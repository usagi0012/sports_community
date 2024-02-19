import { Module } from "@nestjs/common";
import { PersonalassessmenttagController } from "./personalassessmenttag.controller";
import { PersonalassessmenttagService } from "./personalassessmenttag.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/auth.module";
import { Personaltagcounter } from "src/entity/personaltagcounter.entity";
import { Userscore } from "src/entity/userscore.entity";
import { Recruit } from "src/entity/recruit.entity";
import { Match } from "src/entity/match.entity";
import { AlarmserviceModule } from "src/alarm/alarm.module";
import { UserProfile } from "src/entity/user-profile.entity";
import { User } from "src/entity/user.entity";
import { MemberRank } from "src/entity/memberRank.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Personaltagcounter,
            Userscore,
            Recruit,
            Match,
            UserProfile,
            User,
            MemberRank,
        ]),
        AuthModule,
        AlarmserviceModule,
    ],
    controllers: [PersonalassessmenttagController],
    providers: [PersonalassessmenttagService],
    exports: [PersonalassessmenttagService],
})
export class PersonalassessmenttagModule {}
