import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PersonalTagCounterDto } from "./dto/personaltagcounter.dto";
import { Personaltagcounter } from "src/entity/personaltagcounter.entity";
import { Userscore } from "src/entity/userscore.entity";
import { CreatePersonalAssessmentDto } from "./dto/create-personal-assessment.dto";
import { Recruit, Status } from "src/entity/recruit.entity";
import { Match, MatchStatus } from "src/entity/match.entity";
import { User } from "src/entity/user.entity";

@Injectable()
export class PersonalassessmenttagService {
    constructor(
        @InjectRepository(Userscore)
        private readonly userscoreRepository: Repository<Userscore>,
        @InjectRepository(Personaltagcounter)
        private readonly personaltagcounterRepository: Repository<Personaltagcounter>,
        @InjectRepository(Recruit)
        private readonly recruitRepository: Repository<Recruit>,
        @InjectRepository(Match)
        private readonly matchRepository: Repository<Match>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async findTopThreePersonalityAmountUser(userId: number) {
        const topThreeUsersPersonalityAmount =
            await this.userscoreRepository.find({
                where: { profileId: userId },
                order: { personalityAmount: "DESC" },
                take: 3,
            });

        if (
            !topThreeUsersPersonalityAmount ||
            topThreeUsersPersonalityAmount.length === 0
        ) {
            throw new NotFoundException(
                "상위 3명의 인성점수인 유저를 찾을 수 없습니다.",
            );
        }

        // 필요한 데이터만 추출하여 반환
        const result = topThreeUsersPersonalityAmount.map((user) => ({
            userId: user.profileId,
            personalityAmount: user.personalityAmount,
        }));

        return result;
    }

    async findTopThreeAbilityAmountUser(userId: number) {
        const topThreeAbilityAmountUser = await this.userscoreRepository.find({
            where: { profileId: userId },
            order: { abilityAmount: "DESC" },
            take: 3,
        });

        if (
            !topThreeAbilityAmountUser ||
            topThreeAbilityAmountUser.length === 0
        ) {
            throw new NotFoundException(
                "상위 3명의 실력점수인 유저를 찾을 수 없습니다.",
            );
        }

        const result = topThreeAbilityAmountUser.map((user) => ({
            userId: user.profileId,
            abilityAmount: user.abilityAmount,
        }));

        return result;
    }

    async findOneUserAssessment(userId: number) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException("해당 유저를 찾을 수 없습니다.");
        }

        const userAssessment = await this.userscoreRepository.findOne({
            where: { profileId: user.id },
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
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException("해당 유저를 찾을 수 없습니다.");
        }

        const userTag = await this.personaltagcounterRepository.findOne({
            where: { profileId: user.id },
        });
        if (!userTag) {
            throw new NotFoundException("유저의 개인 태그를 찾을 수 없습니다.");
        }

        // 공통 열을 제외한 열 이름 추출
        const tagColumns = Object.keys(userTag).filter(
            (key) =>
                key !== "id" &&
                key !== "profileId" &&
                key !== "createdAt" &&
                key !== "updatedAt" &&
                key !== "userProfile",
        );

        // 태그 열 중에서 최댓값을 가진 열 찾기
        const maxTagColumn = tagColumns.reduce((maxColumn, currentColumn) => {
            if (userTag[currentColumn] > userTag[maxColumn]) {
                return currentColumn;
            }
            return maxColumn;
        }, tagColumns[0]);

        // 최대값을 기준으로 상위 3개 태그 추출
        const topThreeTags = tagColumns
            .filter((column) => column !== maxTagColumn)
            .sort((a, b) => userTag[b] - userTag[a])
            .slice(0, 3);

        // 상위 3개 태그 및 그 값들을 가진 객체 생성
        const topThreeTagsObject = topThreeTags.reduce((result, tag) => {
            result[tag] = userTag[tag];
            return result;
        }, {});

        return topThreeTagsObject;
    }

    async createPersonalAssessment(
        matchId: number,
        recuritedId: number,
        userId: number,
        createPersonalAssessmentDto: CreatePersonalAssessmentDto,
    ) {
        const recurit = await this.recruitRepository.findOne({
            where: { id: recuritedId },
        });

        if (!recurit) {
            throw new NotFoundException(
                "해당 모임은 평가지에 참여할 수 없습니다.",
            );
        }

        if (recurit.status === Status.Recruiting) {
            throw new BadRequestException(
                "모임이 모집 중일 경우 평가지를 작성할 수 없습니다.",
            );
        }

        const personalMatch = await this.matchRepository.findOne({
            where: { id: matchId },
        });

        if (!personalMatch) {
            throw new NotFoundException("해당 경기를 진행하지 않았습니다.");
        }

        const user = await this.userRepository.findOne({
            where: { id: userId },
        });

        if (
            personalMatch.hostid === user.id &&
            personalMatch.guestid === user.id
        ) {
            throw new BadRequestException(
                "경기를 참여한 본인은 평가지 작성에 참여할 수 없습니다.",
            );
        }

        if (personalMatch.status === MatchStatus.REJECTED) {
            throw new BadRequestException("해당 경기는 거절되었습니다.");
        }

        const personalMatchHost = await this.matchRepository.findOne({
            where: { hostid: userId },
        });

        const personalMatchGuest = await this.matchRepository.findOne({
            where: { guestid: userId },
        });

        if (!personalMatchHost && !personalMatchGuest) {
            throw new NotFoundException(
                "해당 모집경기에 참여하지 않은 유저는 설문지를 작성할 수 없습니다.",
            );
        }

        const recruitGroup = await this.matchRepository.findOne({
            where: { recuritedid: recurit.id },
        });

        if (!recruitGroup) {
            throw new NotFoundException("해당 모임은 존재하지 않습니다.");
        }

        const { ...restOfUserscore } = createPersonalAssessmentDto;

        const userScoreData = await this.userscoreRepository.save({
            profileId: user.id,
            ...restOfUserscore,
        });

        // 새로운 데이터가 추가될 때마다 기존 점수와 횟수를 업데이트합니다.
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

    async createPersonalTag(
        matchId: number,
        recuritedId: number,
        userId: number,
        personalTagCounterDto: PersonalTagCounterDto,
    ) {
        const recurit = await this.recruitRepository.findOne({
            where: { id: recuritedId },
        });

        if (!recurit) {
            throw new NotFoundException(
                "해당 모임은 태그 작성에 참여할 수 없습니다.",
            );
        }

        if (recurit.status === Status.Recruiting) {
            throw new BadRequestException(
                "모임이 모집 중일 경우 태그를 작성할 수 없습니다.",
            );
        }

        const personalMatch = await this.matchRepository.findOne({
            where: { id: matchId },
        });

        if (!personalMatch) {
            throw new NotFoundException("해당 경기를 진행하지 않았습니다.");
        }

        const user = await this.userRepository.findOne({
            where: { id: userId },
        });

        if (
            personalMatch.hostid === user.id &&
            personalMatch.guestid === user.id
        ) {
            throw new BadRequestException(
                "경기를 참여한 본인은 태그 작성에 참여할 수 없습니다.",
            );
        }

        if (personalMatch.status === MatchStatus.REJECTED) {
            throw new BadRequestException("해당 경기는 거절되었습니다.");
        }

        const personalMatchHost = await this.matchRepository.findOne({
            where: { hostid: userId },
        });

        const personalMatchGuest = await this.matchRepository.findOne({
            where: { guestid: userId },
        });

        if (!personalMatchHost && !personalMatchGuest) {
            throw new NotFoundException(
                "해당 모집경기에 참여하지 않은 유저는 태그를 작성할 수 없습니다.",
            );
        }

        const recruitGroup = await this.matchRepository.findOne({
            where: { recuritedid: recurit.id },
        });

        if (!recruitGroup) {
            throw new NotFoundException("해당 모임은 존재하지 않습니다.");
        }

        const { ...restOfPersonaltagcounter } = personalTagCounterDto;
        const personalTagData = await this.personaltagcounterRepository.save({
            profileId: user.id,
            ...restOfPersonaltagcounter,
        });

        return personalTagData;
    }

    async updatePesonalAssessment(
        recuritedId: number,
        matchId: number,
        userId: number,
        createPersonalAssessmentDto: CreatePersonalAssessmentDto,
    ) {
        const personalAssessment = await this.userscoreRepository.findOne({
            where: { profileId: userId },
        });

        if (!personalAssessment) {
            throw new NotFoundException(
                "설문지가 존재하지 않은 유저는 작성할 수 없습니다.",
            );
        }

        const recurit = await this.recruitRepository.findOne({
            where: { id: recuritedId },
        });

        if (!recurit) {
            throw new NotFoundException(
                "해당 모임은 평가지 작성에 참여할 수 없습니다.",
            );
        }

        if (recurit.status === Status.Recruiting) {
            throw new BadRequestException(
                "모임이 모집 중일 경우 평가지를 작성할 수 없습니다.",
            );
        }

        const personalMatch = await this.matchRepository.findOne({
            where: { id: matchId },
        });

        if (!personalMatch) {
            throw new NotFoundException("해당 경기를 진행하지 않았습니다.");
        }

        const user = await this.userRepository.findOne({
            where: { id: userId },
        });

        if (
            personalMatch.hostid === user.id &&
            personalMatch.guestid === user.id
        ) {
            throw new BadRequestException(
                "경기를 참여한 본인은 평가지 작성에 참여할 수 없습니다.",
            );
        }

        if (personalMatch.status === MatchStatus.REJECTED) {
            throw new BadRequestException("해당 경기는 거절되었습니다.");
        }

        const personalMatchHost = await this.matchRepository.findOne({
            where: { hostid: userId },
        });

        const personalMatchGuest = await this.matchRepository.findOne({
            where: { guestid: userId },
        });

        if (!personalMatchHost && !personalMatchGuest) {
            throw new NotFoundException(
                "해당 모집경기에 참여하지 않은 유저는 평가지를 작성할 수 없습니다.",
            );
        }

        const recruitGroup = await this.matchRepository.findOne({
            where: { recuritedid: recurit.id },
        });

        if (!recruitGroup) {
            throw new NotFoundException("해당 모임은 존재하지 않습니다.");
        }

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
        recuritedId: number,
        matchId: number,
        userId: number,
        personalTagCounterDto: PersonalTagCounterDto,
    ) {
        const personalTagUser = await this.personaltagcounterRepository.findOne(
            {
                where: { profileId: userId },
            },
        );

        if (!personalTagUser) {
            throw new NotFoundException("개인 태그가 존재하지 않습니다.");
        }

        const recurit = await this.recruitRepository.findOne({
            where: { id: recuritedId },
        });

        if (!recurit) {
            throw new NotFoundException(
                "해당 모임은 태그 작성에 참여할 수 없습니다.",
            );
        }

        if (recurit.status === Status.Recruiting) {
            throw new BadRequestException(
                "모임이 모집 중일 경우 태그를 작성할 수 없습니다.",
            );
        }

        const personalMatch = await this.matchRepository.findOne({
            where: { id: matchId },
        });

        if (!personalMatch) {
            throw new NotFoundException("해당 경기를 진행하지 않았습니다.");
        }

        const user = await this.userRepository.findOne({
            where: { id: userId },
        });

        if (
            personalMatch.hostid === user.id &&
            personalMatch.guestid === user.id
        ) {
            throw new BadRequestException(
                "경기를 참여한 본인은 태그 작성에 참여할 수 없습니다.",
            );
        }

        if (personalMatch.status === MatchStatus.REJECTED) {
            throw new BadRequestException("해당 경기는 거절되었습니다.");
        }

        const personalMatchHost = await this.matchRepository.findOne({
            where: { hostid: userId },
        });

        const personalMatchGuest = await this.matchRepository.findOne({
            where: { guestid: userId },
        });

        if (!personalMatchHost && !personalMatchGuest) {
            throw new NotFoundException(
                "해당 모집경기에 참여하지 않은 유저는 태그를 작성할 수 없습니다.",
            );
        }

        const recruitGroup = await this.matchRepository.findOne({
            where: { recuritedid: recurit.id },
        });

        if (!recruitGroup) {
            throw new NotFoundException("해당 모임은 존재하지 않습니다.");
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
