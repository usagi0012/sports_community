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
import { ApplyingClubModule } from "./applying-club/applying-club.module";
import { ClubMatchModule } from "./club_match/club_match.module";
import { ChatBackEndModule } from "./chatBackEnd/chatBackEnd.module";
import { ChatFrontEndModule } from "./chatFrontEnd/chatFrontEnd.module";
import { AwsModule } from "./aws/aws.module";
import { UserPositionModule } from "./user-position/user-position.module";
import { SseController } from "./alarm/alarm.controller";
import { AlarmserviceModule } from "./alarm/alarm.module";
import { NaverModule } from "./social-login/naver/naver.module";
import { PlaceModule } from "./place/place.module";
import { KakaoModule } from "./social-login/kakao/kakao.module";
import { ScheduleModule } from "@nestjs/schedule";
import { UserAlarmModule } from "./user-alarm/user-alarm.module";
import { SearchModule } from "./search/search.module";
import { ChatInvitationModule } from "./chat-invitation/chat-invitation.module";
import { MessageModule } from "./message/message.module";
import { ReportModule } from "./report/report.module";
import { BanlistModule } from "./banlist/banlist.module";
import { UpdatedRankModule } from "./updated-rank/updated-rank.module";
import { FaqModule } from "./faq/faq.module";
import { NoticeModule } from "./notice/notice.module";
import { QnaModule } from "./qna/qna.module";
import { QnaCommentModule } from "./qnaComment/qnaComment.module";

@Module({
    imports: [
        ConfigProjectModule,
        ScheduleModule.forRoot(),
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
        PlaceModule,
        AlarmserviceModule,
        KakaoModule,
        NaverModule,
        UserAlarmModule,
        SearchModule,
        ChatInvitationModule,
        MessageModule,
        ReportModule,
        BanlistModule,
        UpdatedRankModule,
        FaqModule,
        NoticeModule,
        QnaModule,
        QnaCommentModule,
    ],
    controllers: [AppController, RecruitController, SseController],
    providers: [AppService],
})
export class AppModule {}
