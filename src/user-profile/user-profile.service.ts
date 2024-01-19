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
import { Repository } from "typeorm";
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
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        console.log(user);
        //userId값 가져오기
        const existingNickname = await this.userProfileRepository.findOne({
            where: {
                nickname: createUserProfileDto.nickname,
            },
        });

        // 사용자가 이미 프로필을 작성했는지 확인
        const existingProfile = await this.userProfileRepository.findOne({
            where: {
                user: { id: userId },
            },
        });

        if (existingProfile) {
            // 프로필이 있는경우 수정하라는 에러 뱉기
            throw new BadRequestException(
                "프로필을 이미 작성하셨습니다. 수정해주세요",
            );
        }

        //중복되는 닉네임 불가능
        if (existingNickname) {
            throw new BadRequestException("이미 존재하는 닉네임입니다");
        }

        //이미지 업로드할경우
        if (file) {
            // const uploadedFilePath = await this.awsService.fileupload(file);
            const newProfile = this.userProfileRepository.create({
                ...createUserProfileDto,
                // image: uploadedFilePath,
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
        // 새로운 프로필 생성 및 저장
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
        const existingNickname = await this.userProfileRepository.findOne({
            where: {
                nickname: updateUserProfileDto.nickname,
            },
            relations: ["user"],
        });
        //프로필이 존재하는지 확인
        const existingProfile = await this.userProfileRepository.findOne({
            where: { userId },
        });
        if (!existingProfile) {
            throw new NotFoundException("프로필을 먼저 작성해주세요");
        }
        if (updateUserProfileDto.nickname) {
            if (existingNickname && existingNickname.user.id !== userId) {
                throw new BadRequestException("이미 존재하는 닉네임입니다");
            }
        }
        //성별은 바꿀수 없음
        if (gender) {
            if (existingProfile.gender !== gender) {
                throw new BadRequestException("성별은 바꿀수 없습니다.");
            }
        }
        //이미지 업로드할경우
        if (file) {
            // const uploadedFilePath = await this.awsService.fileupload(file);
            await this.userProfileRepository.update(
                { userId: user.id }, // 첫 번째 매개변수: 업데이트할 엔터티를 식별하는 조건
                {
                    ...updateUserProfileDto,
                    // image: uploadedFilePath,
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
        return {
            statusCode: 200,
            message: "프로필을 수정했습니다.",
            data: { updatedProfile },
        };
    }
}
