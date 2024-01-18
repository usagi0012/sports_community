import { Module } from "@nestjs/common";
import { ClubassessmenttagService } from "./clubassessmenttag.service";
import { ClubassessmenttagController } from "./clubassessmenttag.controller";
import { Clubtagcounter } from "src/entity/clubtagcounter.entity";
import { Clubscore } from "src/entity/clubscore.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/auth.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Clubtagcounter, Clubscore]),
        AuthModule,
    ],
    controllers: [ClubassessmenttagController],
    providers: [ClubassessmenttagService],
})
export class ClubassessmenttagModule {}
