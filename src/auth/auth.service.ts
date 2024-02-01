import {
    BadRequestException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from "@nestjs/common";
import { UserService } from "../user/user.service";
import { SignupUserDto } from "./dto/signup-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import * as nodemailer from "nodemailer";
import { google } from "googleapis";

@Injectable()
export class AuthService {
    constructor(
        private readonly configService: ConfigService,
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    /// 회원가입
    async signup(singupUserDto: SignupUserDto) {
        const { checkPassword, ...createUserDto } = singupUserDto;

        if (createUserDto.password !== checkPassword) {
            throw new BadRequestException(
                "비밀번호와 확인 비밀번호가 일치하지 않습니다.",
            );
        }

        const saltRounds = +this.configService.get<number>("SALT_ROUNDS");
        const salt = await bcrypt.genSalt(saltRounds);

        const hashPassword = await bcrypt.hash(createUserDto.password, salt);

        const userId = await this.userService.create({
            ...createUserDto,
            password: hashPassword,
        });

        // 회원가입 이메일 전송
        createUserDto.isVerified = false;
        const verificationToken = this.generateAccessToken(
            userId.id,
            createUserDto.name,
        );

        // 토큰 생성 함수를 사용합니다.
        const verificationLink = `${this.configService.get<string>(
            "FRONTEND_URL",
        )}/verify?token=${verificationToken}`;

        // OAuth2 설정
        const oauth2Client = new google.auth.OAuth2(
            this.configService.get<string>("GOOGLE_CLIENT_ID"),
            this.configService.get<string>("GOOGLE_CLIENT_SECRET"),
            "https://developers.google.com/oauthplayground",
        );
        oauth2Client.setCredentials({
            refresh_token: this.configService.get<string>(
                "GOOGLE_REFRESH_TOKEN",
            ),
        });

        const accessToken = await oauth2Client.getAccessToken();
        // 이메일 전송
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
                accessToken: accessToken,
            },
            tls: {
                rejectUnauthorized: false,
            },
        } as nodemailer.TransportOptions);

        const mailOptions = {
            from: this.configService.get<string>("GOOGLE_ID"),
            to: createUserDto.email, // 사용자가 입력한 이메일 주소
            subject: "[오농] 회원가입 인증 링크",
            html: `회원가입을 위한 인증을 완료하려면 다음 링크를 클릭하세요: <a href="${verificationLink}">인증하기</a>`,
        };
        console.log(verificationLink);
        smtpTransport.sendMail(mailOptions, (error, response) => {
            error ? console.log(error) : console.log(response);
            smtpTransport.close();
        });

        // 성공적으로 회원가입이 완료된 경우의 반환값
        return {
            statusCode: 201,
            message:
                "회원가입 완료, 이메일로 전송된 링크를 통해 인증후 로그인해주세요.",
        };
    }

    //이메일로 유저 인증
    async verify(token: string): Promise<string> {
        try {
            const payload = this.jwtService.verify(token, {
                secret: this.configService.get<string>(
                    "JWT_ACCESS_TOKEN_SECRET",
                ),
            });
            console.log("Token Payload:", payload);
            // 토큰이 유효하면 이메일 인증 처리 로직을 수행합니다.
            const userId = payload.userId;

            // 사용자의 isVerified를 true로 업데이트합니다.
            await this.userService.update(userId, { isVerified: true });

            // 인증이 성공한 경우 리다이렉트할 URL 반환
            return this.configService.get<string>("REDIRECT_URL");
        } catch (error) {
            // 토큰이 유효하지 않은 경우 예외 처리
            console.error("Token Verification Error:", error);
            throw new BadRequestException("유효하지 않은 토큰입니다.");
        }
    }

    //유저가 비밀번호 잊었을 경우 비밀번호 재설정하기
    async resetPassword(
        email: string,
    ): Promise<{ statusCode: number; message: string }> {
        const user = await this.userService.findUserByEmail(email);

        if (!user) {
            throw new BadRequestException("해당 메일의 유저정보가 없습니다.");
        }

        // 임시 비밀번호 생성
        const temporaryPassword = this.generateTemporaryPassword();

        // 비밀번호 해싱 및 업데이트
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(temporaryPassword, saltRounds);

        await this.userService.update(user.id, { password: hashedPassword });

        // 임시 비밀번호 이메일 전송
        await this.sendTemporaryPasswordEmail(user.email, temporaryPassword);

        return {
            statusCode: 200,
            message: "등록하신 이메일에 임시 비밀번호를 전송했습니다.",
        };
    }

    //임시 비밀번호 생성하기
    private generateTemporaryPassword(): string {
        const temporaryPassword = Math.random().toString(36).substring(7);
        return temporaryPassword;
    }

    //메일로 임시 비밀번호 보내기
    private sendTemporaryPasswordEmail(
        email: string,
        temporaryPassword: string,
    ): void {
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
            subject: "[오농] 비밀번호 재설정 안내",
            text: `임시 비밀번호: ${temporaryPassword}
보안을 위해서 반드시 개인정보수정에서 비밀번호 재설정을 해주세요!`,
        };

        smtpTransport.sendMail(mailOptions, (error, response) => {
            error ? console.log(error) : console.log(response);
            smtpTransport.close();
        });
    }

    /// 로그인
    async login(loginUserDto: LoginUserDto) {
        const { email, password } = loginUserDto;

        const user = await this.userService.findUserByEmail(email);
        console.log("user", user);
        if (!user) {
            throw new NotFoundException("회원가입되지 않은 이메일입니다.");
        }

        if (user.isVerified === false) {
            throw new UnauthorizedException("이메일 인증이 필요합니다.");
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            throw new UnauthorizedException("비밀번호가 일치하지 않습니다.");
        }

        const accessToken = this.generateAccessToken(user.id, user.name);
        const refreshToken = this.generateRefreshToken(user.id);

        await this.userService.update(user.id, {
            currentRefreshToken: refreshToken,
        });

        return {
            accessToken,
            refreshToken,
        };
    }

    /// 토큰 재발급
    async refresh(id: number) {
        const user = await this.userService.findUserById(id);

        const accessToken = this.generateAccessToken(id, user.name);

        return accessToken;
    }

    /// 로그아웃
    async logout(id: number) {
        await this.userService.update(id, {
            currentRefreshToken: null,
        });

        return true;
    }

    /// access 토큰 발급 (private)
    private generateAccessToken(id: number, name: string) {
        const payload = { userId: id, userName: name };

        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>("JWT_ACCESS_TOKEN_SECRET"),
            expiresIn: this.configService.get<string>("JWT_ACCESS_TOKEN_EXP"),
        });

        return accessToken;
    }

    /// refresh 토큰 발급 (private)
    private generateRefreshToken(id: number) {
        const payload = { userId: id };

        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
            expiresIn: this.configService.get<string>("JWT_REFRESH_TOKEN_EXP"),
        });

        return refreshToken;
    }
}
