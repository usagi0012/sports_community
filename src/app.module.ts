import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigProjectModule } from "./config/config.module";
import { TypeormModule } from "./typeorm/typeorm.module";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { ClubModule } from './club/club.module';
import { ApplyingClubModule } from './applying-club/applying-club.module';

@Module({
    imports: [
        ConfigProjectModule,
        TypeormModule.forRoot(),
        AuthModule,
        UserModule,
        ClubModule,
        ApplyingClubModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
