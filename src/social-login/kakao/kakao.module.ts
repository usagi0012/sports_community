import { Module } from "@nestjs/common";
import { KakaoService } from "./kakao.service";
import { KakaoController } from "./kakao.controller";
import { KakaoStrategy } from "./social-kakao-strategy";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "src/user/user.module";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [JwtModule.register({}), UserModule, ConfigModule],
    controllers: [KakaoController],
    providers: [KakaoService, KakaoStrategy],
})
export class KakaoModule {}
