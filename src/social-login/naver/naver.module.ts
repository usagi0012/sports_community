import { Module } from "@nestjs/common";
import { NaverService } from "./naver.service";
import { NaverController } from "./naver.controller";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "src/user/user.module";
import { ConfigModule } from "@nestjs/config";
import { NaverStrategy } from "./social-naver-strategy";

@Module({
    imports: [JwtModule.register({}), UserModule, ConfigModule],
    controllers: [NaverController],
    providers: [NaverService, NaverStrategy],
})
export class NaverModule {}
