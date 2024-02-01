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
import { UserProfile } from "src/entity/user-profile.entity";
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
        @InjectRepository(UserProfile)
        private readonly userProfileRepository: Repository<UserProfile>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async findTopThreePersonalityAmountUser(userId: number) {
        const topThreeUsersPersonalityAmount =
            await this.userscoreRepository.find({
                where: { userId },
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
            userId,
            personalityAmount: user.personalityAmount,
        }));

        return result;
    }

    async findTopThreeAbilityAmountUser(userId: number) {
        const topThreeAbilityAmountUser = await this.userscoreRepository.find({
            where: { userId },
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
            userId,
            abilityAmount: user.abilityAmount,
        }));

        return result;
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

        // 공통 열을 제외한 열 이름 추출
        const tagColumns = Object.keys(userTag).filter(
            (key) =>
                key !== "id" &&
                key !== "userId" &&
                key !== "createdAt" &&
                key !== "updatedAt" &&
                key !== "userId",
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
        const userProfile = await this.userProfileRepository.findOne({
            where: { userId },
        });

        if (!userProfile) {
            throw new NotFoundException("해당 유저를 찾을 수 없습니다.");
        }

        const userTag = await this.personaltagcounterRepository.findOne({
            where: { userId },
        });
        if (!userTag) {
            throw new NotFoundException("유저의 개인 태그를 찾을 수 없습니다.");
        }

        // 공통 열을 제외한 열 이름 추출
        const tagColumns = Object.keys(userTag).filter(
            (key) =>
                key !== "id" &&
                key !== "userId" &&
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
        recuritId: number,
        userId: number,
        playOtherUserId: number,
        createPersonalAssessmentDto: CreatePersonalAssessmentDto,
    ) {

        if (playOtherUserId === userId) {
            throw new BadRequestException(
                "당사자 본인의 설문지를 작성할 수 없습니다.",
            );
        }

        const recurit = await this.recruitRepository.findOne({
            where: { id: recuritId },
        });
        console.log(recurit);

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

        /* if (personalMatch.hostId) {
            throw new BadRequestException(
                "경기를 참여한 본인은 평가지 작성에 참여할 수 없습니다.",
            );
        } */

        if (!personalMatch.guestId && !personalMatch.hostId) {
            throw new NotFoundException("해당 경기를 진행하지 않았습니다.");
        }

        if (personalMatch.status === MatchStatus.REJECTED) {
            throw new BadRequestException("해당 경기는 거절되었습니다.");
        }

        const personalMatchHost = await this.matchRepository.findOne({
            where: { hostId: recurit.hostId },
        });

        const personalMatchGuest = await this.matchRepository.findOne({
            where: { guestId: userId },
        });

        if (!personalMatchHost && !personalMatchGuest) {
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

        const recruitGroup = await this.matchRepository.findOne({
            where: { recruitId: recurit.id },
        });

        if (!recruitGroup) {
            throw new NotFoundException("해당 모임은 존재하지 않습니다.");
        }

        const { ...restOfUserscore } = createPersonalAssessmentDto;

        const userScoreData = await this.userscoreRepository.save({
            userId,
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

        console.log(userScoreData.ability);
        console.log(userScoreData.personality);

        const userScore = await this.userscoreRepository.save(userScoreData);

        return userScore;
    }

    async createPersonalTag(
        matchId: number,
        recuritId: number,
        userId: number,
        playOtherUserId: number,
        personalTagCounterDto: PersonalTagCounterDto,
    ) {
        if (playOtherUserId === userId) {
            throw new BadRequestException(
                "당사자 본인의 설문지를 작성할 수 없습니다.",
            );
        }

        const recurit = await this.recruitRepository.findOne({
            where: { id: recuritId },
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

        if (matchOtherUser.id === userId) {
            throw new BadRequestException(
                "당사자 본인의 설문지를 작성할 수 없습니다.",
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

        const userScore = await this.userscoreRepository.findOne({
            where: { userId },
        });

        if (userScore) {
            throw new BadRequestException("이미 태그를 가지고 있습니다.");
        }

        if (personalMatch.status === MatchStatus.REJECTED) {
            throw new BadRequestException("해당 경기는 거절되었습니다.");
        }

        const personalMatchHost = await this.matchRepository.findOne({
            where: { hostId: recurit.hostId },
        });

        const personalMatchGuest = await this.matchRepository.findOne({
            where: { guestId: userId },
        });

        if (!personalMatchHost && !personalMatchGuest) {
            throw new NotFoundException(
                "해당 모집경기에 참여하지 않은 유저는 태그를 작성할 수 없습니다.",
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

        const recruitGroup = await this.matchRepository.findOne({
            where: { recruitId: recurit.id },
        });

        if (!recruitGroup) {
            throw new NotFoundException("해당 모임은 존재하지 않습니다.");
        }

        const { ...restOfPersonaltagcounter } = personalTagCounterDto;
        const personalTagData = await this.personaltagcounterRepository.save({
            userId,
            ...restOfPersonaltagcounter,
        });

        return personalTagData;
    }

    async updatePesonalAssessment(
        recuritId: number,
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

        const personalAssessment = await this.userscoreRepository.findOne({
            where: { userId },
        });

        if (!personalAssessment) {
            throw new NotFoundException(
                "설문지가 존재하지 않은 유저는 작성할 수 없습니다.",
            );
        }

        const recurit = await this.recruitRepository.findOne({
            where: { id: recuritId },
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

        /*  if (
            personalMatch.hostId === userId &&
            personalMatch.guestId === userId
        ) {
            throw new BadRequestException(
                "경기를 참여한 본인은 태그 작성에 참여할 수 없습니다.",
            );
        } */

        if (personalMatch.status === MatchStatus.REJECTED) {
            throw new BadRequestException("해당 경기는 거절되었습니다.");
        }

        const personalMatchHost = await this.matchRepository.findOne({
            where: { hostId: recurit.hostId },
        });

        const personalMatchGuest = await this.matchRepository.findOne({
            where: { guestId: userId },
        });

        if (!personalMatchHost && !personalMatchGuest) {
            throw new NotFoundException(
                "해당 모집경기에 참여하지 않은 유저는 평가지를 작성할 수 없습니다.",
            );
        }

        const recruitGroup = await this.matchRepository.findOne({
            where: { recruitId: recurit.id },
        });

        if (!recruitGroup) {
            throw new NotFoundException("해당 모임은 존재하지 않습니다.");
        }

        const personalAssessmentUserData =
            await this.userscoreRepository.findOne({
                where: { userId },
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
        recuritId: number,
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

        const personalTagUser = await this.personaltagcounterRepository.findOne(
            {
                where: { userId },
            },
        );

        if (!personalTagUser) {
            throw new NotFoundException("개인 태그가 존재하지 않습니다.");
        }

        const recurit = await this.recruitRepository.findOne({
            where: { id: recuritId },
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

        /*    if (
            personalMatch.hostId === userId &&
            personalMatch.guestId === userId
        ) {
            throw new BadRequestException(
                "경기를 참여한 본인은 태그 작성에 참여할 수 없습니다.",
            );
        } */

        if (personalMatch.status === MatchStatus.REJECTED) {
            throw new BadRequestException("해당 경기는 거절되었습니다.");
        }

        const personalMatchHost = await this.matchRepository.findOne({
            where: { hostId: recurit.hostId },
        });

        const personalMatchGuest = await this.matchRepository.findOne({
            where: { guestId: userId },
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

        if (!personalMatchHost && !personalMatchGuest) {
            throw new NotFoundException(
                "해당 모집경기에 참여하지 않은 유저는 태그를 작성할 수 없습니다.",
            );
        }

        const recruitGroup = await this.matchRepository.findOne({
            where: { recruitId: recurit.id },
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
