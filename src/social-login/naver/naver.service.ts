import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";

@Injectable()
export class NaverService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async OAuthLogin({ req, res }) {
        if (!req.user || !req.user.email) {
            // 유효한 사용자 정보가 없는 경우에 대한 예외 처리
            return false;
        }
        const userEmail = req.user.email;
        const userNickName = req.user.nickname;
        let user = await this.userService.findUserByEmail(userEmail);

        if (!user) {
            user = await this.userService.create({
                ...req.user,
                name: userNickName,
            });
        }

        if (!user) {
            throw new BadRequestException(
                "사용자를 생성하거나 찾지 못했습니다.",
            );
        }

        const refreshToken = this.generateRefreshToken(user.id);
        await this.userService.update(user.id, {
            currentRefreshToken: refreshToken,
        });

        const accessToken = this.generateAccessToken(user.id);
        res.cookie("access_token", accessToken, { httpOnly: true });

        if (user) {
            res.redirect(
                `${this.configService.get<string>(
                    "LOCAL",
                )}/api/auth/naver/success?accessToken=${accessToken}&refreshToken=${refreshToken}`, //받아주는 페이지 만들어야함
            );
        } else {
            res.redirect(
                `${this.configService.get<string>(
                    "LOCAL",
                )}/api/auth/login/failure`,
            );
        }
    }

    private generateRefreshToken(id: number) {
        const payload = { userId: id };

        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
            expiresIn: this.configService.get<string>("JWT_REFRESH_TOKEN_EXP"),
        });

        return refreshToken;
    }

    /// access 토큰 발급 (private)
    private generateAccessToken(id: number) {
        const payload = { userId: id };
        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>("JWT_ACCESS_TOKEN_SECRET"),
            expiresIn: this.configService.get<string>("JWT_ACCESS_TOKEN_EXP"),
        });

        return accessToken;
    }
}
