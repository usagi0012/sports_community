import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigProjectModule } from "./config/config.module";
import { TypeormModule } from "./typeorm/typeorm.module";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { PersonalassessmenttagModule } from "./personalassessmenttag/personalassessmenttag.module";
import { ClubassessmenttagModule } from "./clubassessmenttag/clubassessmenttag.module";
import { ClubModule } from "./club/club.module";
import { UserProfileModule } from "./user-profile/user-profile.module";
import { UserCalenderModule } from "./user-calender/user-calender.module";
import { RecruitController } from "./recruit/recruit.controller";
import { RecruitModule } from "./recruit/recruit.module";
import { MatchModule } from "./match/match.module";
import { RecruitService } from "./recruit/recruit.service";
import { ApplyingClubModule } from "./applying-club/applying-club.module";
import { ClubMatchModule } from "./club_match/club_match.module";
import { ChatBackEndModule } from "./chatBackEnd/chatBackEnd.module";
import { ChatFrontEndModule } from "./chatFrontEnd/chatFrontEnd.module";
import { AwsModule } from "./aws/aws.module";
import { UserPositionModule } from "./user-position/user-position.module";
import { SseController } from "./alarm/alarm.controller";
import { AlarmserviceModule } from "./alarm/alarm.module";
import { MatchModule } from './match/match.module';

@Module({
    imports: [
        ConfigProjectModule,
        TypeormModule.forRoot(),
        AuthModule,
        UserModule,
        PersonalassessmenttagModule,
        ClubassessmenttagModule,
        ClubModule,
        ApplyingClubModule,
        UserProfileModule,
        UserCalenderModule,
        RecruitModule,
        MatchModule,
        ChatBackEndModule,
        ChatFrontEndModule,
        AwsModule,
        ClubMatchModule,
        UserPositionModule,
        AlarmserviceModule,
    ],
    controllers: [AppController, RecruitController, SseController],
    providers: [AppService],
})
export class AppModule {}
