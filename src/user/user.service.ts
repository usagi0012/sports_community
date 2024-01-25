import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User, UserType } from "../entity/user.entity";
import { EntityManager, Repository, Transaction } from "typeorm";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { ChangeUserDto } from "./dto/change-user.dto";
import { UserProfile } from "src/entity/user-profile.entity";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly configService: ConfigService,
    ) {}

    async putAdmin(userId: number) {
        const user = await this.userRepository.findOne({
            where: {
                id: userId,
            },
        });

        user.userType = UserType.ADMIN;
        return await this.userRepository.save(user);
    }
    async create(createUserDto: CreateUserDto) {
        const { email } = createUserDto;

        const isUser = await this.findUserByEmail(email);

        if (isUser) {
            throw new ConflictException("이미 존재하는 이메일입니다.");
        }

        const user = await this.userRepository.save(createUserDto);

        return user;
    }

    async findAll() {
        return await this.userRepository.find({
            select: ["email", "name", "createdAt", "updatedAt"],
        });
    }

    async findUserById(id: number) {
        return await this.userRepository.findOne({
            where: { id },
            select: [
                "id",
                "email",
                "name",
                "createdAt",
                "updatedAt",
                "clubId",
                "userType",
            ],
        });
    }

    async logout(id: number) {
        await this.update(id, {
            currentRefreshToken: null,
        });

        return true;
    }
    async findUserByIdAll(id: number) {
        return await this.userRepository.findOne({
            where: { id },
        });
    }

    async findUserByEmail(email: string) {
        return await this.userRepository.findOne({
            where: { email },
            select: ["id", "email", "password"],
        });
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        const isUser = await this.findUserById(id);

        if (!isUser) {
            throw new NotFoundException("존재하지 않는 사용자입니다.");
        }

        const result = await this.userRepository.update(
            {
                id,
            },
            {
                ...updateUserDto,
            },
        );
        return result;
    }

    //내 정보 수정
    async updateUser(id: number, changeUserDto: ChangeUserDto) {
        const user = await this.findUserByIdAll(id);
        const userPassword = (await this.findUserByEmail(user.email)).password;

        if (!user) {
            throw new NotFoundException("존재하지 않는 사용자입니다.");
        }

        // 현재 비밀번호 확인
        if (changeUserDto.password) {
            const isCurrentPasswordCorrect = await bcrypt.compare(
                changeUserDto.password,
                userPassword,
            );

            if (!isCurrentPasswordCorrect) {
                throw new UnauthorizedException(
                    "현재 비밀번호가 일치하지 않습니다.",
                );
            }

            //변경할 비밀번호가 기존 비밀번호와 같은 경우
            if (changeUserDto.changePassword === changeUserDto.password) {
                throw new NotFoundException(
                    "변경할 비밀번호는 현재 비밀번호와 다르게 입력해주세요.",
                );
            }
        }

        // 새로운 비밀번호와 확인 비밀번호 일치 여부 확인
        if (
            changeUserDto.changePassword !== changeUserDto.changePasswordConfirm
        ) {
            throw new BadRequestException(
                "새로운 비밀번호와 확인 비밀번호가 일치하지 않습니다.",
            );
        }

        // 새로운 비밀번호 업데이트
        if (changeUserDto.changePassword) {
            const saltRounds = +this.configService.get<number>("SALT_ROUNDS");
            const salt = await bcrypt.genSalt(saltRounds);
            const hashPassword = await bcrypt.hash(
                changeUserDto.changePassword,
                salt,
            );

            await this.userRepository.update(
                { id },
                {
                    password: hashPassword,
                },
            );
        }

        // 수정하기
        await this.userRepository.update(
            { id },
            {
                email: changeUserDto.email,
            },
        );
        const updatedUser = await this.findUserById(id);

        return {
            statusCode: 200,
            message: "내 정보를 수정했습니다.",
            data: { updatedUser },
        };
    }
    //내 정보 삭제
    async deleteUserById(userId) {
        const user = await this.findUserById(userId);

        if (!user) {
            throw new NotFoundException("존재하지 않는 사용자입니다.");
        }

        if (userId !== user.id) {
            throw new NotFoundException("권한이 없습니다.");
        }
        const token = await this.update(userId, {
            currentRefreshToken: null,
        });
        console.log(token);
        await this.userRepository.delete({ id: userId });
        return {
            statusCode: 200,
            message: "탈퇴했습니다.",
        };
    }
}
