import {
    BadRequestException,
    ConflictException,
    Injectable,
    MethodNotAllowedException,
    NotAcceptableException,
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
import { CheckPasswordDto } from "./dto/checkPassword.dto";
import * as nodemailer from "nodemailer";
import { google } from "googleapis";

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

    //정보 수정시 현재 비밀번호 확인
    async checkPassword(id: number, checkPasswordDto: CheckPasswordDto) {
        const user = await this.findUserByIdAll(id);
        const userPassword = (await this.findUserByEmail(user.email)).password;

        const isCurrentPasswordCorrect = await bcrypt.compare(
            checkPasswordDto.password,
            userPassword,
        );
        const updatedUser = await this.findUserById(user.id);
        if (!isCurrentPasswordCorrect) {
            return {
                success: false,
                message: "현재 비밀번호가 일치하지 않습니다.",
            };
        }

        return {
            success: true,
            message: "현재 비밀번호가 일치합니다.",
            data: updatedUser.id,
        };
    }
    async findUserByEmail(email: string) {
        return await this.userRepository.findOne({
            where: { email },
            select: ["id", "email", "password", "isVerified"],
        });
    }

    async existEmail(email: string) {
        const user = await this.userRepository.findOne({
            where: { email },
        });
        return { existEmail: !!user };
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

    //이메일 검증 함수
    async isValidEmail(email) {
        // 간단한 이메일 유효성 검사를 위한 정규 표현식
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // 내 정보 수정
    async updateUser(id: number, changeUserDto: ChangeUserDto) {
        const user = await this.findUserByIdAll(id);
        console.log(changeUserDto);
        console.log(user);

        if (!user) {
            throw new NotFoundException("존재하지 않는 사용자입니다.");
        }

        if (changeUserDto.email) {
            // 변경하려는 이메일이 형식에 맞는지 검사
            if (!this.isValidEmail(changeUserDto.email)) {
                throw new BadRequestException(
                    "유효하지 않은 이메일 주소입니다.",
                );
            }

            if (changeUserDto.email === user.email) {
                throw new NotFoundException(
                    "현재 이메일로는 변경할 수 없습니다.",
                );
            }
            if (changeUserDto.email !== user.email) {
                const existingEmail = await this.findUserByEmail(
                    changeUserDto.email,
                );
                console.log(existingEmail);
                if (existingEmail) {
                    throw new ConflictException("이미 존재하는 이메일입니다.");
                }
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

        // 이메일 업데이트
        if (changeUserDto.email) {
            await this.userRepository.update(
                { id },
                {
                    email: changeUserDto.email,
                },
            );
        }

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

    private sendCheckEmailCode(email: string, checkEmailCode: string): void {
        const smtpTransport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: this.configService.get<string>("GOOGLE_ID"),
                clientId: this.configService.get<string>("GOOGLE_CLIENT_ID"),
                clientSecret: this.configService.get<string>(
                    "GOOGLE_CLIENT_SECRET",
                ),
                refreshToken: this.configService.get<string>(
                    "GOOGLE_REFRESH_TOKEN",
                ),
            },
            tls: {
                rejectUnauthorized: false,
            },
        } as nodemailer.TransportOptions);

        const mailOptions = {
            from: this.configService.get<string>("GOOGLE_ID"),
            to: email,
            subject: "[오농] 이메일 재설정 안내",
            text: `인증코드: ${checkEmailCode}
인증코드를 입력해주셔야 이메일 변경이 완료됩니다.`,
        };

        smtpTransport.sendMail(mailOptions, (error, response) => {
            error ? console.log(error) : console.log(response);
            smtpTransport.close();
        });
    }

    private generateCheckEmailCode(): string {
        // 확인 코드 생성 로직 (랜덤 문자열 등)
        const checkEmailCode = Math.random().toString(36).substring(6);
        return checkEmailCode;
    }

    async saveCheckEmailCode(
        id: number,
        checkEmailCode: string,
    ): Promise<void> {
        await this.userRepository.update(id, { checkEmailCode });
    }

    async sendEmailCode(id, changeUserDto: ChangeUserDto) {
        const user = await this.findUserByIdAll(id);
        const checkEmailCode = this.generateCheckEmailCode();
        // 데이터베이스에 확인 코드 저장
        await this.saveCheckEmailCode(id, checkEmailCode);

        // 이메일 보내기
        this.sendCheckEmailCode(changeUserDto.email, checkEmailCode);

        user.checkEmailCode = checkEmailCode;
        user.isVerifiedEmail = false;
        await this.userRepository.save(user);
    }

    async checkEmailCode(id, changeUserDto: ChangeUserDto) {
        const user = await this.findUserByIdAll(id);
        if (!user) {
            throw new NotFoundException("존재하지 않는 사용자입니다.");
        }
        if (changeUserDto.checkEmailCode !== user.checkEmailCode) {
            throw new MethodNotAllowedException("인증번호가 틀립니다.");
        }
        user.checkEmailCode = null;
        user.isVerifiedEmail = true;

        // 저장
        await this.userRepository.save(user);
        return {
            statusCode: 200,
            message: "인증 완료",
        };
    }

    async checkExistCode(id: number) {
        const user = await this.findUserByIdAll(id);
        const checkEmailCode = user.checkEmailCode;
        const isVerifiedEmail = user.isVerifiedEmail;
        if (!user) {
            throw new NotFoundException("존재하지 않는 사용자입니다.");
        }

        return { checkEmailCode, isVerifiedEmail };
    }
}
