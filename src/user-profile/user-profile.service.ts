import {
    BadRequestException,
    HttpException,
    HttpStatus,
    Injectable,
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

@Injectable()
export class UserProfileService {
    constructor(
        @InjectRepository(UserProfile)
        private readonly userProfileRepository: Repository<UserProfile>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}
    //프로필 작성하기
    async create(userId: number, createUserProfileDto: CreateUserProfileDto) {
        //userId값 가져오기
        const existingNickname = await this.userProfileRepository.findOne({
            where: {
                nickname: createUserProfileDto.nickname,
            },
        });
        //중복되는 닉네임 불가능
        if (existingNickname) {
            throw new BadRequestException("이미 존재하는 닉네임입니다");
        }

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

        // 새로운 프로필 생성 및 저장
        const newProfile = this.userProfileRepository.create({
            ...createUserProfileDto,
            user: { id: userId },
        });
        const savedProfile = await this.userProfileRepository.save(newProfile);
        delete savedProfile.user;

        // 저장된 프로필 반환 또는 다양한 응답 방식으로 설정
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
    async update(userId: number, updateUserProfileDto: UpdateUserProfileDto) {
        const { nickname, description, image, height, gender } =
            updateUserProfileDto;
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
        await this.userProfileRepository.update(
            { userId },
            {
                nickname,
                description,
                image,
                height,
                gender,
            },
        );
        const updatedProfile = await this.userProfileRepository.findOne({
            where: { userId },
        });
        delete updatedProfile.user;
        return {
            statusCode: 200,
            message: "프로필을 수정했습니다.",
            data: { updatedProfile },
        };
    }
}
