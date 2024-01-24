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
import * as uuid from "uuid";
import { SignupAdminDto } from "./dto/admin-signup.dto";

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

        return {
            statusCode: 201,
            message: "회원가입 완료되었습니다.",
            data: { userId },
        };
    }
    //관리자로 가입하기
    async admin_signup(signupAdminDto: SignupAdminDto) {
        const { checkPassword, ...createAdminDto } = signupAdminDto;

        if (createAdminDto.password !== checkPassword) {
            throw new BadRequestException(
                "비밀번호와 확인 비밀번호가 일치하지 않습니다.",
            );
        }

        const saltRounds = +this.configService.get<number>("SALT_ROUNDS");
        const salt = await bcrypt.genSalt(saltRounds);

        const hashPassword = await bcrypt.hash(createAdminDto.password, salt);

        const userId = await this.userService.create({
            ...createAdminDto,
            password: hashPassword,
        });

        return {
            statusCode: 201,
            message: "관리자 회원가입 완료되었습니다.",
            data: { userId },
        };
    }

    private async sendVerificationEmail(
        email: string,
        verificationToken: string,
    ): Promise<void> {
        // 이메일 전송 설정
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "your_email@gmail.com", // 발신자 Gmail 이메일 주소
                pass: "your_gmail_password", // 발신자 Gmail 계정 비밀번호
            },
        });

        // 이메일 내용 설정
        const mailOptions = {
            from: "your_email@gmail.com", // 발신자 이메일 주소
            to: email, // 수신자 이메일 주소
            subject: "회원가입 인증 이메일", // 이메일 제목
            text: `회원가입을 완료하려면 아래 링크를 클릭하세요: 
                  http://your-app-domain/verify?token=${verificationToken}`,
            // HTML 형식을 사용하려면 text 대신 html 속성을 사용할 수 있습니다.
        };

        // 이메일 전송
        await transporter.sendMail(mailOptions);
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
