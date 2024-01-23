import { Module } from "@nestjs/common";
import { ClubassessmenttagService } from "./clubassessmenttag.service";
import { ClubassessmenttagController } from "./clubassessmenttag.controller";
import { Clubtagcounter } from "src/entity/clubtagcounter.entity";
import { Clubscore } from "src/entity/clubscore.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/auth.module";
import { ClubMatch } from "src/entity/club_match.entity";
import { Club } from "src/entity/club.entity";
import { User } from "src/entity/user.entity";
import { ClubApplication } from "src/entity/club-application.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Clubtagcounter,
            Clubscore,
            ClubMatch,
            Club,
            User,
            ClubApplication,
        ]),
        AuthModule,
    ],
    controllers: [ClubassessmenttagController],
    providers: [ClubassessmenttagService],
})
export class ClubassessmenttagModule {}
