import {
    BadRequestException,
    HttpException,
    HttpStatus,
    Injectable,
    NotAcceptableException,
    NotFoundException,
    Req,
} from "@nestjs/common";
import { CreateUserProfileDto } from "./dto/create-user-profile.dto";
import { UpdateUserProfileDto } from "./dto/update-user-profile.dto";
import { UserProfile } from "src/entity/user-profile.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entity/user.entity";
import { In, Repository } from "typeorm";
import { NotFoundError } from "rxjs";
import { AwsService } from "../aws/aws.service";
import { Alarmservice } from "src/alarm/alarm.service";

@Injectable()
export class UserProfileService {
    constructor(
        @InjectRepository(UserProfile)
        private readonly userProfileRepository: Repository<UserProfile>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly awsService: AwsService,
        private readonly alarmService: Alarmservice,
    ) {}
    //프로필 작성하기
    async create(
        userId: number,
        createUserProfileDto: CreateUserProfileDto,
        file: Express.Multer.File,
    ) {
        //유저 찾기
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });

        // 사용자가 이미 프로필을 작성했는지 확인
        const existingProfile = await this.userProfileRepository.findOne({
            where: {
                user: { id: userId },
            },
        });

        if (existingProfile) {
            // 프로필이 있는 경우 수정하라는 에러 뱉기
            throw new BadRequestException(
                "프로필을 이미 작성하셨습니다. 수정해주세요",
            );
        }

        // 닉네임이 기재되었을 때 중복 여부 확인
        if (createUserProfileDto.nickname) {
            const existingNickname = await this.userProfileRepository.findOne({
                where: {
                    nickname: createUserProfileDto.nickname,
                },
            });

            if (existingNickname) {
                throw new BadRequestException("이미 존재하는 닉네임입니다");
            }
        }

        // 이미지 업로드할 경우
        if (file) {
            const uploadedFilePath = await this.awsService.fileupload(file);
            console.log("이미지", uploadedFilePath);

            // 닉네임이 기재되지 않았을 때 디폴트값 이름
            if (!createUserProfileDto.nickname) {
                createUserProfileDto.nickname = user.name;
            }

            const newProfile = this.userProfileRepository.create({
                ...createUserProfileDto,
                image: uploadedFilePath,
                user: user,
            });

            const savedProfile =
                await this.userProfileRepository.save(newProfile);

            // 생성된 프로필 반환
            return {
                statusCode: 201,
                message: "프로필을 생성했습니다.",
                data: { savedProfile },
            };
        }

        if (!createUserProfileDto.nickname) {
            createUserProfileDto.nickname = user.name;
        }

        const newProfile = this.userProfileRepository.create({
            ...createUserProfileDto,
            user: { id: user.id },
        });

        const savedProfile = await this.userProfileRepository.save(newProfile);
        delete savedProfile.user;

        // 생성된 프로필 반환
        return {
            statusCode: 201,
            message: "프로필을 생성했습니다.",
            data: { savedProfile },
        };
    }

    //id를 이용해서 프로필 찾기
    async findOne(userId) {
        const userProfile = await this.userProfileRepository.findOne({
            where: { userId },
        });
        if (!userProfile) {
            throw new NotFoundException("프로필 정보가 없습니다.");
        }
        delete userProfile.user;
        return {
            statusCode: 200,
            message: "프로필을 조회했습니다.",
            data: { userProfile },
        };
    }

    //프로필 수정하기
    async update(
        userId: number,
        updateUserProfileDto: UpdateUserProfileDto,
        file,
    ) {
        const { nickname, description, height, gender } = updateUserProfileDto;
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (userId !== user.id) {
            throw new NotAcceptableException("권한이 없습니다.");
        }

        //닉네임이 존재하면 중복 불가능
        if (nickname !== undefined && nickname !== null) {
            const existingNickname = await this.userProfileRepository.findOne({
                where: {
                    nickname: updateUserProfileDto.nickname,
                },
                relations: ["user"],
            });
            if (updateUserProfileDto.nickname) {
                if (existingNickname && existingNickname.user.id !== userId) {
                    throw new BadRequestException("이미 존재하는 닉네임입니다");
                }
            }
        }
        //프로필이 존재하는지 확인
        const existingProfile = await this.userProfileRepository.findOne({
            where: { userId },
        });
        if (!existingProfile) {
            throw new NotFoundException("프로필을 먼저 작성해주세요");
        }

        //성별은 바꿀수 없음
        if (gender) {
            if (existingProfile.gender !== gender) {
                throw new BadRequestException("성별은 바꿀수 없습니다.");
            }
        }
        //이미지 업로드할경우
        if (file) {
            const uploadedFilePath = await this.awsService.fileupload(file);
            await this.userProfileRepository.update(
                { userId: user.id }, // 첫 번째 매개변수: 업데이트할 엔터티를 식별하는 조건
                {
                    ...updateUserProfileDto,
                    image: uploadedFilePath,
                },
            );

            const updatedProfile = await this.userProfileRepository.findOne({
                where: { userId },
                relations: ["user"],
            });
            // 생성된 프로필 반환
            return {
                statusCode: 201,
                message: "프로필을 수정했습니다.",
                data: { updatedProfile },
            };
        }
        await this.userProfileRepository.update(
            { userId },
            {
                nickname,
                description,
                height,
                gender,
            },
        );

        const updatedProfile = await this.userProfileRepository.findOne({
            where: { userId },
            relations: ["user"],
        });
        delete updatedProfile.user;
        return {
            statusCode: 200,
            message: "프로필을 수정했습니다.",
            data: { updatedProfile },
        };
    }

    //친구 추가하기
    async friednUser(userId: number, otherUserId: number) {
        try {
            const me = await this.userRepository.findOne({
                where: {
                    id: userId,
                },
            });
            me.friendUser = me.friendUser || [];

            if (!me.friendUser.includes(otherUserId.toString())) {
                me.friendUser.push(otherUserId.toString());

                return await this.userRepository.save(me);
            }

            return me;
        } catch (error) {
            throw new NotFoundException(error);
        }
    }

    //block fried
    async blockUser(userId: number, otherUserId: number) {
        try {
            const me = await this.userRepository.findOne({
                where: {
                    id: userId,
                },
            });
            me.blockUser = me.blockUser || [];

            if (!me.blockUser.includes(otherUserId.toString())) {
                me.blockUser.push(otherUserId.toString());

                return await this.userRepository.save(me);
            }

            return me;
        } catch (error) {
            throw new NotFoundException(error);
        }
    }

    // 친구 삭제하기
    async deleteFriend(userId: number, otherUserId: number) {
        try {
            const me = await this.userRepository.findOne({
                where: {
                    id: userId,
                },
            });

            me.friendUser = me.friendUser || [];

            const index = me.friendUser.indexOf(otherUserId.toString());

            if (index !== -1) {
                me.friendUser.splice(index, 1);

                await this.userRepository.save(me);
            }

            return me;
        } catch (error) {
            throw new NotFoundException(error);
        }
    }

    //dlelteblock fried
    async deleteBlock(userId: number, otherUserId: number) {
        try {
            const me = await this.userRepository.findOne({
                where: {
                    id: userId,
                },
            });

            me.blockUser = me.blockUser || [];

            console.log("otherUserId", otherUserId);

            const index = me.blockUser.indexOf(otherUserId.toString());

            if (index !== -1) {
                me.blockUser.splice(index, 1);

                await this.userRepository.save(me);
            }

            return me;
        } catch (error) {
            throw new NotFoundException(error);
        }
    }

    //친구 목록 불러오기
    async getFriend(userId: number) {
        try {
            const me = await this.userRepository.findOne({
                where: {
                    id: userId,
                },
            });
            const friendIds: number[] = me.friendUser.map(Number);

            const friends = await this.userRepository.find({
                where: { id: In(friendIds) },
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            });

            return friends;
        } catch (error) {}
    }

    //친구인지 아닌지

    async findFriend(userId: number, otherUserId: number) {
        try {
            const me = await this.userRepository.findOne({
                where: {
                    id: userId,
                },
            });
            const friendIds: number[] = me.friendUser.map(Number);

            const isOtherUserFriend = friendIds.includes(otherUserId);

            if (isOtherUserFriend) {
                return true;
            } else {
                return null;
            }
        } catch (error) {
            console.log("Error:", error);
            return null;
        }
    }

    //블락유저 목록 불러오기
    async getBlock(userId: number) {
        try {
            const me = await this.userRepository.findOne({
                where: {
                    id: userId,
                },
            });
            const bolckIds: number[] = me.blockUser.map(Number);

            const friends = await this.userRepository.find({
                where: { id: In(bolckIds) },
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            });

            return friends;
        } catch (error) {}
    }

    //블락 인지 아닌지

    async findBlock(userId: number, otherUserId: number) {
        try {
            const me = await this.userRepository.findOne({
                where: {
                    id: userId,
                },
            });
            const blockIds: number[] = me.blockUser.map(Number);

            const isOtherBlockIds = blockIds.includes(otherUserId);

            if (isOtherBlockIds) {
                return { message: "블락유저" };
            } else {
                return { message: "블락유저아님" };
            }
        } catch (error) {
            console.error("에러 발생:", error);
            throw error;
        }
    }
}
