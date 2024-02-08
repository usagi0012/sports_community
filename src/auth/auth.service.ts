import {
    BadRequestException,
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
} from "@nestjs/common";
import { UserService } from "../user/user.service";
import { SignupUserDto } from "./dto/signup-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { ConfigService } from "@nestjs/config";
import { JwtService, TokenExpiredError } from "@nestjs/jwt";
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
            "verification",
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
            html: `회원가입을 위한 인증을 완료하려면 다음 링크를 클릭하세요: <a href="http://${verificationLink}">${verificationLink}</a>`,
        };

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

    // 이메일로 유저 인증
    async verify(token: string): Promise<string> {
        try {
            const payload = this.jwtService.verify(token, {
                secret: this.configService.get<string>(
                    "JWT_ACCESS_TOKEN_SECRET",
                ),
            });
            console.log("Token Payload:", payload);

            const userId = payload.userId;

            // 사용자의 isVerified를 true로 업데이트합니다.
            await this.userService.update(userId, { isVerified: true });

            // 인증이 성공한 경우 리다이렉트할 URL 반환
            return "http://localhost:8001/login.html";
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                // 토큰이 만료된 경우, 알림 메시지 반환
                return "TokenExpired";
            } else {
                // 다른 토큰 검증 오류에 대한 예외 처리
                console.error("Token Verification Error:", error);
                throw new BadRequestException("유효하지 않은 토큰입니다.");
            }
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

    private async sendVerificationEmail(
        email: string,
        verificationLink: string,
    ): Promise<void> {
        try {
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
                    clientId:
                        this.configService.get<string>("GOOGLE_CLIENT_ID"),
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
                to: email,
                subject: "[오농] 회원가입 인증 링크",
                html: `회원가입을 위한 인증을 완료하려면 다음 링크를 클릭하세요: <a href="${verificationLink}">${verificationLink}</a>`,
            };

            await smtpTransport.sendMail(mailOptions);
            smtpTransport.close();
        } catch (error) {
            console.error("이메일 전송 에러:", error);
            throw new InternalServerErrorException(
                "이메일 전송에 실패했습니다.",
            );
        }
    }

    // 재인증 이메일 보내기
    async resendVerificationEmail(
        email: string,
    ): Promise<{ statusCode: number; message: string }> {
        const user = await this.userService.findUserByEmail(email);

        if (!user) {
            throw new BadRequestException("해당 메일의 유저정보가 없습니다.");
        }

        if (user.isVerified) {
            throw new BadRequestException("이미 인증된 사용자입니다.");
        }

        // 새로운 인증 토큰 생성
        const verificationToken = this.generateAccessToken(
            user.id,
            "verification",
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
            to: email,
            subject: "[오농] 회원가입 인증 링크",
            html: `회원가입을 위한 인증을 완료하려면 다음 링크를 클릭하세요: <a href="http://${verificationLink}">${verificationLink}</a>`,
        };

        smtpTransport.sendMail(mailOptions, (error, response) => {
            error ? console.log(error) : console.log(response);
            smtpTransport.close();
        });

        return {
            statusCode: 200,
            message: "인증 메일을 다시 전송했습니다.",
        };
    }

    async resendVerificationEmailIfRequired(email: string) {
        try {
            const existingUser = await this.userService.findUserByEmail(email);

            if (!existingUser) {
                throw new NotFoundException("가입되지 않은 이메일입니다.");
            }

            if (existingUser.isVerified) {
                throw new ConflictException("이미 인증된 이메일입니다.");
            }

            // 인증 메일 재전송 로직 추가
            const verificationToken = this.generateAccessToken(
                existingUser.id,
                "verification",
            );
            const verificationLink = `${this.configService.get<string>(
                "FRONTEND_URL",
            )}/verify?token=${verificationToken}`;

            // 이메일 전송 로직 추가
            await this.sendVerificationEmail(
                existingUser.email,
                verificationLink,
            );

            return {
                statusCode: 200,
                message: "인증 메일이 재전송되었습니다.",
            };
        } catch (error) {
            console.error("이메일 재전송 에러:", error);
            throw new InternalServerErrorException(
                "이메일 재전송에 실패했습니다.",
            );
        }
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

        const accessToken = this.generateAccessToken(user.id, "login");
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

        const accessToken = this.generateAccessToken(id, "refreshToken");

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
    private generateAccessToken(id: number, purpose: string) {
        const payload = { userId: id };

        let expiresIn: string;
        if (purpose === "verification") {
            // 인증 토큰의 경우, 만료 시간을 적절히 설정
            expiresIn = this.configService.get<string>(
                "JWT_VERIFICATION_TOKEN_EXP",
            );
        } else {
            // 다른 용도의 토큰의 경우, 적절한 설정
            expiresIn = this.configService.get<string>("JWT_ACCESS_TOKEN_EXP");
        }

        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>("JWT_ACCESS_TOKEN_SECRET"),
            expiresIn,
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
