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
            verificationStatus: "미인증", // "미인증" 상태로 초기화
        });

        // 회원가입 이메일 전송

        const verificationCode = this.generateVerificationCode(); // 인증번호 생성 함수 필요
        const verificationLink = `${this.configService.get<string>(
            "FRONTEND_URL",
        )}/verify?code=${verificationCode}`;

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
            subject: "회원가입 인증 링크",
            text: `회원가입을 위한 인증을 완료하려면 다음 링크를 클릭하세요: ${verificationLink}`,
        };

        smtpTransport.sendMail(mailOptions, (error, response) => {
            error ? console.log(error) : console.log(response);
            smtpTransport.close();
        });

        // 성공적으로 회원가입이 완료된 경우의 반환값
        return {
            statusCode: 201,
            message: "회원가입 완료되었습니다.",
            data: { userId },
        };
    }

    //인증코드 생성하기
    private generateVerificationCode(): string {
        const length: number = 6;
        const characters: string = "0123456789";
        let verificationCode: string = "";

        for (let i: number = 0; i < length; i++) {
            const randomIndex: number = Math.floor(
                Math.random() * characters.length,
            );
            verificationCode += characters.charAt(randomIndex);
        }

        return verificationCode;
    }

    /// 로그인
    async login(loginUserDto: LoginUserDto) {
        const { email, password } = loginUserDto;

        const user = await this.userService.findUserByEmail(email);
        if (!user) {
            throw new NotFoundException("회원가입되지 않은 이메일입니다.");
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

        return {
            accessToken,
        };
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
