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

        if (user)
            res.redirect(
                `http://localhost:8001/api/auth/naver/success?accessToken=${accessToken}&refreshToken=${refreshToken}`, //받아주는 페이지 만들어야함
            );
        else res.redirect("http://localhost:8001/api/auth/login/failure");
        // 로그인에 실폐했을 경우 프론트 페이지를 개설해 줘야함(카카오와 네이버로그인 실패 page를 하나로 묶어서 제작)
    }
    private generateRefreshToken(userId: number): string {
        const payload = { sub: userId };
        const secret = this.configService.get<string>(
            "JWT_REFRESH_TOKEN_SECRET",
        );
        const expiresIn = this.configService.get<string>(
            "JWT_REFRESH_TOKEN_EXP",
        );
        return this.jwtService.sign(payload, {
            secret,
            expiresIn,
        });
    }

    private generateAccessToken(userId: number): string {
        const payload = { sub: userId };
        const secret = this.configService.get<string>(
            "JWT_ACCESS_TOKEN_SECRET",
        );
        const expiresIn = this.configService.get<string>(
            "JWT_ACCESS_TOKEN_EXP",
        );

        return this.jwtService.sign(payload, {
            secret,
            expiresIn,
        });
    }
}
