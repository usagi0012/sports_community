import { Module } from "@nestjs/common";
import { UpdatedRankController } from "./updated-rank.controller";
import { UpdatedRankService } from "./updated-rank.service";
import { MemberRank } from "src/entity/memberRank.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UpdatedMemberRank } from "src/entity/updatedMemberRank.entity";
import { ClubRank } from "src/entity/clubRank.entity";
import { UpdatedClubRank } from "src/entity/updatedClubRank.entity";
import { PersonalassessmenttagModule } from "src/personalassessmenttag/personalassessmenttag.module";
import { ClubassessmenttagModule } from "src/clubassessmenttag/clubassessmenttag.module";
import { UserProfile } from "src/entity/user-profile.entity";

@Module({
    imports: [
        PersonalassessmenttagModule,
        ClubassessmenttagModule,
        TypeOrmModule.forFeature([
            MemberRank,
            UpdatedMemberRank,
            ClubRank,
            UpdatedClubRank,
            UserProfile,
        ]),
    ],
    controllers: [UpdatedRankController],
    providers: [UpdatedRankService],
})
export class UpdatedRankModule {}
