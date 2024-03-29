import { BadRequestException, Injectable } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

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

        let user = await this.userService.findUserByEmail(userEmail);

        if (!user) {
            user = await this.userService.create({
                ...req.user,
                name: req.user.nickname,
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
        // 코드를 만드는거 1, 코드가 일치하는지 1
        const accessToken = this.generateAccessToken(user.id);
        res.cookie("access_token", accessToken, { httpOnly: true });
        if (user) {
            res.redirect(
                `${this.configService.get<string>(
                    "LOCAL",
                )}/api/auth/kakao/success?accessToken=${accessToken}&refreshToken=${refreshToken}`,
            );
        } else {
            res.redirect(
                `${this.configService.get<string>(
                    "LOCAL",
                )}/api/auth/login/failure`,
            );
        }
    }

    private generateAccessToken(id: number) {
        const payload = { userId: id };

        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>("JWT_ACCESS_TOKEN_SECRET"),
            expiresIn: this.configService.get<string>("JWT_ACCESS_TOKEN_EXP"),
        });

        return accessToken;
    }

    private generateRefreshToken(id: number) {
        const payload = { userId: id };

        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
            expiresIn: this.configService.get<string>("JWT_REFRESH_TOKEN_EXP"),
        });

        return refreshToken;
    }
}
