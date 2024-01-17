import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigProjectModule } from "./config/config.module";
import { TypeormModule } from "./typeorm/typeorm.module";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { ClubModule } from './club/club.module';
import { UserProfileModule } from "./user-profile/user-profile.module";
import { UserCalenderModule } from './user-calender/user-calender.module';
import { RecruitController } from "./recruit/recruit.controller";
import { RecruitModule } from "./recruit/recruit.module";
import { MatchModule } from "./match/match.module";
import { RecruitService } from "./recruit/recruit.service";

@Module({
    imports: [
        ConfigProjectModule,
        TypeormModule.forRoot(),
        AuthModule,
        UserModule,
        ClubModule,
        UserProfileModule,
        UserCalenderModule,
        RecruitModule,
        MatchModule,
    ],
    controllers: [AppController, RecruitController],
    providers: [AppService],
})
export class AppModule {}
