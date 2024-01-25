import { BadRequestException, Injectable } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { join } from "path";

@Injectable()
export class KakaoService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async OAuthLogin({ req, res }) {
        // 1.회원조회

        if (!req.user || !req.user.email) {
            // 유효한 사용자 정보가 없는 경우에 대한 예외 처리
            return false;
        }

        const userEmail = req.user.email;
        console.log(userEmail);
        let user = await this.userService.findUserByEmail(userEmail);

        if (!user) {
            user = await this.userService.create({
                ...req.user,
                name: req.user.nickname,
            });
        }

        if (!user) {
            throw new BadRequestException("Failed to create or retrieve user.");
        }

        const refreshToken = this.generateRefreshToken(user.id);
        await this.userService.update(user.id, {
            currentRefreshToken: refreshToken,
        });

        const accessToken = this.generateAccessToken(user.id);
        res.cookie("access_token", accessToken, { httpOnly: true });

        res.sendFile(join(__dirname, "..", "../kakaoHtml/redirect.html"));
    }
    private generateRefreshToken(userId: number): string {
        const payload = { sub: userId };
        const expiresIn = this.configService.get<string>(
            "JWT_REFRESH_TOKEN_EXP",
        );
        return this.jwtService.sign(payload, {
            secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
            expiresIn,
        });
    }

    private generateAccessToken(userId: number): string {
        const payload = { sub: userId };
        const expiresIn = this.configService.get<string>(
            "JWT_ACCESS_TOKEN_EXP",
        );
        return this.jwtService.sign(payload, {
            secret: this.configService.get<string>("JWT_ACCESS_TOKEN_SECRET"),
            expiresIn,
        });
    }
}
