import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PersonalTagCounterDto } from "./dto/personaltagcounter.dto";
import { Personaltagcounter } from "src/entity/personaltagcounter.entity";
import { Userscore } from "src/entity/userscore.entity";
import { CreatePersonalAssessmentDto } from "./dto/create-personal-assessment.dto";

@Injectable()
export class PersonalassessmenttagService {
    constructor(
        @InjectRepository(Userscore)
        private readonly userscoreRepository: Repository<Userscore>,
        @InjectRepository(Personaltagcounter)
        private readonly personaltagcounterRepository: Repository<Personaltagcounter>,
    ) {}

    async createPersonalAssessment(
        userId: number,
        createPersonalAssessmentDto: CreatePersonalAssessmentDto,
    ) {
        const { ...restOfUserscore } = createPersonalAssessmentDto;

        const userScoreData = await this.userscoreRepository.save({
            profileId: userId,
            ...restOfUserscore,
        });

        // 새로운 데이터가 추가될 때마다 기존 점수와 횟수를 업데이트합니다.
        userScoreData.count += 1;
        userScoreData.personality =
            userScoreData.personalityAmount / userScoreData.count;
        userScoreData.ability =
            userScoreData.abilityAmount / userScoreData.count;
        const userScore = await this.userscoreRepository.save(userScoreData);

        return userScore;
    }

    async createPersonalTag(
        userId: number,
        personalTagCounterDto: PersonalTagCounterDto,
    ) {
        const { ...restOfPersonaltagcounter } = personalTagCounterDto;
        const personalTagData = await this.personaltagcounterRepository.save({
            userId,
            ...restOfPersonaltagcounter,
        });

        return personalTagData;
    }

    async updatePesonalAssessment(
        userId: number,
        createPersonalAssessmentDto: CreatePersonalAssessmentDto,
    ) {
        const personalAssessmentUserData =
            await this.userscoreRepository.findOne({
                where: { profileId: userId },
            });

        personalAssessmentUserData.count += 1;

        personalAssessmentUserData.personalityAmount +=
            createPersonalAssessmentDto.personalityAmount;

        personalAssessmentUserData.abilityAmount +=
            createPersonalAssessmentDto.abilityAmount;

        personalAssessmentUserData.personality =
            personalAssessmentUserData.personalityAmount /
            personalAssessmentUserData.count;

        personalAssessmentUserData.ability =
            personalAssessmentUserData.abilityAmount /
            personalAssessmentUserData.count;

        const personalAssessmentUser = this.userscoreRepository.save(
            personalAssessmentUserData,
        );

        return personalAssessmentUser;
    }

    async updatePesonalTag(
        userId: number,
        personalTagCounterDto: PersonalTagCounterDto,
    ) {
        const personalTagUser = await this.personaltagcounterRepository.findOne(
            {
                where: { userId: userId },
            },
        );

        if (!personalTagUser) {
            throw new NotFoundException("개인 태그가 존재하지 않습니다.");
        }

        for (const key in personalTagCounterDto) {
            if (personalTagCounterDto.hasOwnProperty(key) && key !== "userId") {
                // 해당 key에 대한 값이 숫자이면서 1일 때만 +1 증가
                if (personalTagCounterDto[key] === 1) {
                    personalTagUser[key] += 1;
                }
            }
        }
        const updatedPersonalTag =
            await this.personaltagcounterRepository.save(personalTagUser);

        return updatedPersonalTag;
    }
}
