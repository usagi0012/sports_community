import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MoreThanOrEqual, Repository } from "typeorm";
import { PersonalTagCounterDto } from "./dto/personaltagcounter.dto";
import { Personaltagcounter } from "src/entity/personaltagcounter.entity";
import { Userscore } from "src/entity/userscore.entity";
import { CreatePersonalAssessmentDto } from "./dto/create-personal-assessment.dto";
import { Match } from "src/entity/match.entity";
import { UserProfile } from "src/entity/user-profile.entity";
import { User } from "src/entity/user.entity";
import { MemberRank } from "src/entity/memberRank.entity";

@Injectable()
export class PersonalassessmenttagService {
    constructor(
        @InjectRepository(Userscore)
        private readonly userscoreRepository: Repository<Userscore>,
        @InjectRepository(Personaltagcounter)
        private readonly personaltagcounterRepository: Repository<Personaltagcounter>,
        @InjectRepository(Match)
        private readonly matchRepository: Repository<Match>,
        @InjectRepository(UserProfile)
        private readonly userProfileRepository: Repository<UserProfile>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(MemberRank)
        private readonly memberRankRepository: Repository<MemberRank>,
    ) {}

    // 테스트중
    async findTopThreePersonalityAmountUser() {
        const topThreeUsersPersonalityAmount =
            await this.userscoreRepository.find({
                select: {
                    personalityAmount: true,
                    userId: true,
                    personality: true,
                },
                where: {
                    count: MoreThanOrEqual(10),
                },
                order: { personalityAmount: "DESC" },
                take: 3,
            });

        for (const userScore of topThreeUsersPersonalityAmount) {
            const savedRank = await this.memberRankRepository
                .save({
                    userId: userScore.userId,
                    isPersonality: true,
                    isAbility: false,
                    personalityScore: userScore.personality,
                })
                .catch((error) => {
                    console.error("Error saving rank:", error);
                });
        }

        return topThreeUsersPersonalityAmount;
    }

    async findTopThreeAbilityAmountUser() {
        const topThreeAbilityAmountUser = await this.userscoreRepository.find({
            select: { abilityAmount: true, userId: true, ability: true },
            where: {
                count: MoreThanOrEqual(10),
            },
            order: { abilityAmount: "DESC" },
            take: 3,
        });

        for (const userScore of topThreeAbilityAmountUser) {
            const savedRank2 = await this.memberRankRepository
                .save({
                    userId: userScore.userId,
                    isPersonality: false,
                    isAbility: true,
                    abilityScore: userScore.ability,
                })
                .catch((error) => {
                    console.error("Error saving rank:", error);
                });
        }

        return topThreeAbilityAmountUser;
    }

    async findOneUserAssessment(userId: number) {
        const userAssessment = await this.userscoreRepository.findOne({
            where: { userId },
            select: {
                personalityAmount: true,
                personality: true,
                abilityAmount: true,
                ability: true,
                count: true,
            },
        });

        if (!userAssessment) {
            throw new NotFoundException("유저 평점을 찾을 수 없습니다.");
        }

        return userAssessment;
    }

    async findOneUserTag(userId: number) {
        const userTag = await this.personaltagcounterRepository.findOne({
            where: { userId },
        });
        if (!userTag) {
            throw new NotFoundException("유저의 개인 태그를 찾을 수 없습니다.");
        }

        const tagColumns = Object.keys(userTag).filter(
            (key) =>
                key !== "id" &&
                key !== "userId" &&
                key !== "createdAt" &&
                key !== "updatedAt" &&
                key !== "userProfile",
        );

        tagColumns.reduce((maxColumn, currentColumn) => {
            if (userTag[currentColumn] > userTag[maxColumn]) {
                return currentColumn;
            }
            return maxColumn;
        }, tagColumns[0]);

        const topThreeTags = tagColumns
            .filter((column) => column)
            .sort((a, b) => userTag[b] - userTag[a])
            .slice(0, 3);

        const topThreeTagsObject = topThreeTags.reduce((result, tag) => {
            result[tag] = userTag[tag];
            return result;
        }, {});

        return topThreeTagsObject;
    }

    async findOtherOneUserAssessment(userId: number) {
        const userProfile = await this.userProfileRepository.findOne({
            where: { userId },
        });

        if (!userProfile) {
            throw new NotFoundException("해당 유저를 찾을 수 없습니다.");
        }

        const userAssessment = await this.userscoreRepository.findOne({
            where: { userId },
            select: {
                personalityAmount: true,
                personality: true,
                abilityAmount: true,
                ability: true,
                count: true,
            },
        });

        if (!userAssessment) {
            throw new NotFoundException("유저 평점을 찾을 수 없습니다.");
        }

        return userAssessment;
    }

    async findOtherOneUserTag(userId: number) {
        const userTag = await this.personaltagcounterRepository.findOne({
            where: { userId },
        });
        if (!userTag) {
            throw new NotFoundException("유저의 개인 태그를 찾을 수 없습니다.");
        }

        const tagColumns = Object.keys(userTag).filter(
            (key) =>
                key !== "id" &&
                key !== "userId" &&
                key !== "createdAt" &&
                key !== "updatedAt" &&
                key !== "userProfile",
        );

        tagColumns.reduce((maxColumn, currentColumn) => {
            if (userTag[currentColumn] > userTag[maxColumn]) {
                return currentColumn;
            }
            return maxColumn;
        }, tagColumns[0]);

        const topThreeTags = tagColumns
            .filter((column) => column)
            .sort((a, b) => userTag[b] - userTag[a])
            .slice(0, 3);

        const topThreeTagsObject = topThreeTags.reduce((result, tag) => {
            result[tag] = userTag[tag];
            return result;
        }, {});

        return topThreeTagsObject;
    }

    async updatePesonalAssessment(
        matchId: number,
        userId: number,
        playOtherUserId: number,
        createPersonalAssessmentDto: CreatePersonalAssessmentDto,
    ) {
        if (playOtherUserId === userId) {
            throw new BadRequestException(
                "당사자 본인의 설문지를 작성할 수 없습니다.",
            );
        }

        let personalAssessment = await this.userscoreRepository.findOne({
            where: { userId },
        });

        if (!personalAssessment) {
            const newPersonalAssessment = await this.createPersonalAssessment(
                matchId,
                userId,
                playOtherUserId,
                createPersonalAssessmentDto,
            );

            return newPersonalAssessment;
        }

        const personalMatch = await this.matchRepository.findOne({
            where: { id: matchId },
        });

        if (!personalMatch) {
            throw new NotFoundException("해당 경기를 진행하지 않았습니다.");
        }

        const matchOtherUser = await this.userRepository.findOne({
            where: { id: playOtherUserId },
        });

        if (!matchOtherUser) {
            throw new NotFoundException(
                "같은 경기에 참석하지 않은 유저는 설문지를 작성할 수 없습니다.",
            );
        }

        if (!personalMatch.hostId && !personalMatch.guestId) {
            throw new NotFoundException(
                "해당 모집경기에 참여하지 않은 유저는 평가지를 작성할 수 없습니다.",
            );
        }

        if (personalMatch.hostId === personalMatch.guestId) {
            throw new BadRequestException(
                "해당 유저는 설문지를 작성할 수 없습니다.",
            );
        }

        const personalAssessmentUserData =
            await this.userscoreRepository.findOne({
                where: { userId },
            });

        if (!personalAssessmentUserData) {
            throw new NotFoundException(
                "해당 유저의 평가지를 찾을 수 없습니다.",
            );
        }

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

        personalAssessmentUserData.personality = parseFloat(
            personalAssessmentUserData.personality.toFixed(3),
        );

        personalAssessmentUserData.ability = parseFloat(
            personalAssessmentUserData.ability.toFixed(3),
        );

        const personalAssessmentUser = this.userscoreRepository.save(
            personalAssessmentUserData,
        );

        return personalAssessmentUser;
    }

    async updatePesonalTag(
        matchId: number,
        userId: number,
        playOtherUserId: number,
        personalTagCounterDto: PersonalTagCounterDto,
    ) {
        if (playOtherUserId === userId) {
            throw new BadRequestException(
                "당사자 본인의 설문지를 작성할 수 없습니다.",
            );
        }

        let personalTagUser = await this.personaltagcounterRepository.findOne({
            where: { userId },
        });

        if (!personalTagUser) {
            const newPersonalTagUser = await this.createPersonalTag(
                +matchId,
                +userId,
                +playOtherUserId,
                personalTagCounterDto,
            );

            return newPersonalTagUser;
        }

        const personalMatch = await this.matchRepository.findOne({
            where: { id: matchId },
        });

        if (!personalMatch) {
            throw new NotFoundException("해당 경기를 진행하지 않았습니다.");
        }

        const matchOtherUser = await this.userRepository.findOne({
            where: { id: playOtherUserId },
        });

        if (!matchOtherUser) {
            throw new NotFoundException(
                "같은 경기에 참석하지 않은 유저는 설문지를 작성할 수 없습니다.",
            );
        }

        for (const key in personalTagCounterDto) {
            if (personalTagCounterDto.hasOwnProperty(key)) {
                if (personalTagCounterDto[key] === 1) {
                    personalTagUser[key] += 1;
                }
            }
        }
        const updatedPersonalTag =
            await this.personaltagcounterRepository.save(personalTagUser);

        return updatedPersonalTag;
    }

    private async createPersonalAssessment(
        matchId: number,
        userId: number,
        playOtherUserId: number,
        createPersonalAssessmentDto: CreatePersonalAssessmentDto,
    ) {
        if (playOtherUserId === userId) {
            throw new BadRequestException(
                "당사자 본인의 설문지를 작성할 수 없습니다.",
            );
        }

        const personalMatch = await this.matchRepository.findOne({
            where: { id: matchId },
        });

        const matchOtherUser = await this.userRepository.findOne({
            where: { id: playOtherUserId },
        });

        if (!matchOtherUser) {
            throw new NotFoundException(
                "같은 경기에 참석하지 않은 유저는 설문지를 작성할 수 없습니다.",
            );
        }
        if (
            personalMatch.guestId === matchOtherUser.id &&
            personalMatch.hostId === matchOtherUser.id
        ) {
            throw new BadRequestException(
                "당사자 본인은 자기 평가서를 작성할 수 없습니다.",
            );
        }

        if (!personalMatch.guestId && !personalMatch.hostId) {
            throw new NotFoundException("해당 경기를 진행하지 않았습니다.");
        }

        if (!personalMatch.hostId && !personalMatch.guestId) {
            throw new NotFoundException(
                "해당 모집경기에 참여하지 않은 유저는 설문지를 작성할 수 없습니다.",
            );
        }

        const findAssessment = await this.userscoreRepository.findOne({
            where: { userId },
        });

        if (findAssessment) {
            throw new BadRequestException(
                "이미 평가를 제출한 사람은 제출을 할 수 없습니다.",
            );
        }

        const { ...restOfUserscore } = createPersonalAssessmentDto;

        const userScoreData = await this.userscoreRepository.save({
            userId,
            ...restOfUserscore,
        });

        userScoreData.count += 1;
        userScoreData.personality =
            userScoreData.personalityAmount / userScoreData.count;
        userScoreData.ability =
            userScoreData.abilityAmount / userScoreData.count;

        userScoreData.personality = parseFloat(
            userScoreData.personality.toFixed(3),
        );

        userScoreData.ability = parseFloat(userScoreData.ability.toFixed(3));

        const userScore = await this.userscoreRepository.save(userScoreData);

        return userScore;
    }

    private async createPersonalTag(
        matchId: number,
        userId: number,
        playOtherUserId: number,
        personalTagCounterDto: PersonalTagCounterDto,
    ) {
        if (playOtherUserId === userId) {
            throw new BadRequestException(
                "당사자 본인의 설문지를 작성할 수 없습니다.",
            );
        }

        const personalMatch = await this.matchRepository.findOne({
            where: { id: matchId },
        });

        if (!personalMatch.guestId && !personalMatch.hostId) {
            throw new NotFoundException("해당 경기를 진행하지 않았습니다.");
        }

        const matchOtherUser = await this.userRepository.findOne({
            where: { id: playOtherUserId },
        });

        if (!matchOtherUser) {
            throw new NotFoundException(
                "같은 경기에 참석하지 않은 유저는 설문지를 작성할 수 없습니다.",
            );
        }

        if (
            personalMatch.guestId === matchOtherUser.id &&
            personalMatch.hostId === matchOtherUser.id
        ) {
            throw new BadRequestException(
                "당사자 본인은 자기 평가서를 작성할 수 없습니다.",
            );
        }

        const findUserTag = await this.personaltagcounterRepository.findOne({
            where: { userId },
        });

        if (findUserTag) {
            throw new BadRequestException(
                "이미 평가를 제출한 사람은 제출을 할 수 없습니다.",
            );
        }

        const { ...restOfPersonaltagcounter } = personalTagCounterDto;
        const personalTagData = await this.personaltagcounterRepository.save({
            userId,
            ...restOfPersonaltagcounter,
        });

        return personalTagData;
    }
}
