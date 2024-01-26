import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "../user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { accessTokenGuard } from "./guard/access-token.guard";
import { accessTokenStrategy } from "./strategy/access-token.strategy";
import { refreshTokenGuard } from "./guard/refresh-token.guard";
import { refreshTokenStrategy } from "./strategy/refresh-token.strategy";
import { KakaoStrategy } from "src/social-login/kakao/social-kakao-strategy";
import { NaverStrategy } from "src/social-login/naver/social-naver-strategy";

@Module({
    imports: [UserModule, JwtModule],
    exports: [
        accessTokenGuard,
        accessTokenStrategy,
        refreshTokenGuard,
        refreshTokenStrategy,
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        accessTokenGuard,
        accessTokenStrategy,
        refreshTokenGuard,
        refreshTokenStrategy,
        KakaoStrategy,
        NaverStrategy,
    ],
})
export class AuthModule {}
