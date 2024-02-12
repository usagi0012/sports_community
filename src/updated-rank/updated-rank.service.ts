import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { ClubassessmenttagService } from "src/clubassessmenttag/clubassessmenttag.service";
import { ClubRank } from "src/entity/clubRank.entity";
import { MemberRank } from "src/entity/memberRank.entity";
import { UpdatedClubRank } from "src/entity/updatedClubRank.entity";
import { UpdatedMemberRank } from "src/entity/updatedMemberRank.entity";
import { UserProfile } from "src/entity/user-profile.entity";
import { PersonalassessmenttagService } from "src/personalassessmenttag/personalassessmenttag.service";
import { Repository } from "typeorm";

@Injectable()
export class UpdatedRankService {
    constructor(
        @InjectRepository(MemberRank)
        private readonly memberRankRepository: Repository<MemberRank>,
        @InjectRepository(UpdatedMemberRank)
        private readonly updatedMemberRankRepository: Repository<UpdatedMemberRank>,
        @InjectRepository(ClubRank)
        private readonly clubRankRepository: Repository<ClubRank>,
        @InjectRepository(UserProfile)
        private readonly userProfileRepository: Repository<UserProfile>,
        @InjectRepository(UpdatedClubRank)
        private readonly updatedClubRankRepository: Repository<UpdatedClubRank>,
        private readonly personalAssessmentTagService: PersonalassessmenttagService,
        private readonly clubAssesssmentTagService: ClubassessmenttagService,
    ) {}

    @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
    async savePersonalRank() {
        await this.memberRankRepository.delete({});
        await this.personalAssessmentTagService.findTopThreeAbilityAmountUser();
        await this.personalAssessmentTagService.findTopThreePersonalityAmountUser();

        return this.memberRankRepository.find({
            order: { personalityScore: "DESC", abilityScore: "DESC" },
        });
    }

    async findCurrentPersonalityRank() {
        return await this.memberRankRepository.find({
            where: { isPersonality: true },
            order: { personalityScore: "DESC" },
        });
    }

    async findCurrentAbilityRank() {
        return await this.memberRankRepository.find({
            where: { isAbility: true },
            order: { abilityScore: "DESC" },
        });
    }

    @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
    async saveClubRank() {
        await this.clubRankRepository.delete({});
        await this.clubAssesssmentTagService.findTopThreeClub();

        return this.clubRankRepository.find({});
    }

    async findCurrentClubRank() {
        return await this.clubRankRepository.find();
    }

    async getPersonalRank() {
        const personalRank = await this.memberRankRepository.find();

        const personalRankWithNicknames = await Promise.all(
            personalRank.map(async (personal) => {
                const userProfile = await this.userProfileRepository.findOne({
                    where: { userId: personal.userId },
                    select: ["nickname"],
                });
                (personal as any).nickname = userProfile.nickname;
                return personal;
            }),
        );

        return personalRankWithNicknames;
    }

    async getClubRank() {
        return await this.clubRankRepository.find();
    }
}
