import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateClubassessmenttagDto } from "./dto/create-clubassessmenttag.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Clubscore } from "src/entity/clubscore.entity";
import { Repository } from "typeorm";
import { Clubtagcounter } from "src/entity/clubtagcounter.entity";
import { ClubTagCounterDto } from "./dto/clubtagcounter.dto";

@Injectable()
export class ClubassessmenttagService {
    constructor(
        @InjectRepository(Clubscore)
        private readonly clubscoreRepository: Repository<Clubscore>,
        @InjectRepository(Clubtagcounter)
        private readonly clubtagcounterRepository: Repository<Clubtagcounter>,
    ) {}

    async createClubAssessment(
        clubId: number,
        createClubAssessmenttagDto: CreateClubassessmenttagDto,
    ) {
        const { ...restOfClubscore } = createClubAssessmenttagDto;
        const clubScoreData = await this.clubscoreRepository.save({
            clubId: clubId,
            ...restOfClubscore,
        });

        clubScoreData.count += 1;
        clubScoreData.personality =
            clubScoreData.abilityAmount / clubScoreData.count;
        clubScoreData.ability =
            clubScoreData.abilityAmount / clubScoreData.count;

        const clubScore = await this.clubscoreRepository.save(clubScoreData);

        return clubScore;
    }

    async createClubTag(clubId: number, clubTagCounterDto: ClubTagCounterDto) {
        const { ...restOfClubtagcounter } = clubTagCounterDto;
        const clubTagData = await this.clubtagcounterRepository.save({
            clubId,
            ...restOfClubtagcounter,
        });

        return clubTagData;
    }

    async updateClubAssessment(
        clubId: number,
        userId: number,
        createClubAssessmenttagDto: CreateClubassessmenttagDto,
    ) {
        const clubAssessmentUserData = await this.clubscoreRepository.findOne({
            where: { clubId: clubId },
        });

        clubAssessmentUserData.count += 1;

        clubAssessmentUserData.personalityAmount +=
            createClubAssessmenttagDto.personalityAmount;
        clubAssessmentUserData.abilityAmount +=
            createClubAssessmenttagDto.abilityAmount;

        clubAssessmentUserData.personality =
            clubAssessmentUserData.personalityAmount /
            clubAssessmentUserData.count;

        clubAssessmentUserData.ability =
            clubAssessmentUserData.abilityAmount / clubAssessmentUserData.count;

        const clubAssessmentUser = this.clubscoreRepository.save(
            clubAssessmentUserData,
        );

        return clubAssessmentUser;
    }

    async updateClubTag(
        clubId: number,
        userId: number,
        clubTagCounterDto: ClubTagCounterDto,
    ) {
        const clubTagUser = await this.clubtagcounterRepository.findOne({
            where: { clubId: clubId },
        });
        if (!clubTagUser) {
            throw new NotFoundException("클럽 태그가 존재하지 않습니다.");
        }

        for (const key in clubTagCounterDto) {
            if (clubTagCounterDto.hasOwnProperty(key) && key !== "clubId") {
                // 해당 key에 대한 값이 숫자이면서 1일 때만 +1 즐가
                if (clubTagCounterDto[key] === 1) {
                    clubTagUser[key] += 1;
                }
            }
        }
        const updatedClubTag =
            await this.clubtagcounterRepository.save(clubTagUser);
        return updatedClubTag;
    }
}
