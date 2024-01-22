import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { CreateClubassessmenttagDto } from "./dto/create-clubassessmenttag.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Clubscore } from "src/entity/clubscore.entity";
import { Repository } from "typeorm";
import { Clubtagcounter } from "src/entity/clubtagcounter.entity";
import { ClubTagCounterDto } from "./dto/clubtagcounter.dto";
import { ClubMatch, ClubMatchStatus } from "src/entity/club_match.entity";
import { Club } from "src/entity/club.entity";
import {
    ClubApplication,
    ClubApplicationStatus,
} from "src/entity/club-application.entity";
import { User } from "src/entity/user.entity";

@Injectable()
export class ClubassessmenttagService {
    constructor(
        @InjectRepository(Clubscore)
        private readonly clubscoreRepository: Repository<Clubscore>,
        @InjectRepository(Clubtagcounter)
        private readonly clubtagcounterRepository: Repository<Clubtagcounter>,
        @InjectRepository(ClubMatch)
        private readonly clubMatchRepository: Repository<ClubMatch>,
        @InjectRepository(Club)
        private readonly clubRepository: Repository<Club>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(ClubApplication)
        private readonly clubApplicationRepository: Repository<ClubApplication>,
    ) {}

    async findOneClubAssessment(clubId: number) {
        const club = await this.clubRepository.findOne({
            where: { id: clubId },
        });

        if (!club) {
            throw new NotFoundException("해당 클럽이 존재하지 않습니다.");
        }

        const clubAssessment = await this.clubscoreRepository.findOne({
            where: { clubId: club.id },
            select: {
                personalityAmount: true,
                personality: true,
                abilityAmount: true,
                ability: true,
                count: true,
            },
        });

        if (!clubAssessment) {
            throw new NotFoundException("클럽 평점을 찾을 수 없습니다.");
        }

        return clubAssessment;
    }

    async findOneClubTag(clubId: number) {
        const club = await this.clubRepository.findOne({
            where: { id: clubId },
        });

        if (!club) {
            throw new NotFoundException("해당 클럽이 존재하지 않습니다.");
        }

        const clubTag = await this.clubtagcounterRepository.findOne({
            where: { clubId: club.id },
        });

        if (!clubTag) {
            throw new NotFoundException("클럽의 태그를 찾을 수 없습니다.");
        }

        const clubTagClumns = Object.keys(clubTag).filter(
            (key) =>
                key !== "id" &&
                key !== "clubId" &&
                key !== "createdAt" &&
                key !== "updatedAt" &&
                key !== "club",
        );

        const clubMaxTagColumn = clubTagClumns.reduce(
            (maxColumn, currentColumn) => {
                if (clubTag[currentColumn] > clubTag[maxColumn]) {
                    return currentColumn;
                }
                return maxColumn;
            },
            clubTagClumns[0],
        );

        const topThreeClubTags = clubTagClumns
            .filter((column) => column !== clubMaxTagColumn)
            .sort((a, b) => clubTag[b] - clubTag[a])
            .slice(0, 3);

        const topThreeClubTagsObject = topThreeClubTags.reduce(
            (result, tag) => {
                result[tag] = clubTag[tag];
                return result;
            },
            {},
        );

        return topThreeClubTagsObject;
    }

    async createClubAssessment(
        clubMatchId: number,
        clubId: number,
        userId: number,
        createClubAssessmenttagDto: CreateClubassessmenttagDto,
    ) {
        const club = await this.clubRepository.findOne({
            where: { id: clubId },
        });

        if (!club) {
            throw new NotFoundException(
                "해당 클럽은 평가지에 참여할 수 없습니다.",
            );
        }

        const user = await this.userRepository.findOne({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException("해당 유저는 존재하지 않습니다.");
        }

        const clubApplication = await this.clubApplicationRepository.findOne({
            where: { userId: user.id },
        });

        if (
            clubApplication.status === ClubApplicationStatus.BEFORE_APPLICATION
        ) {
            throw new BadRequestException(
                "해당 유저는 클럽 평가지에 참여할 수없습니다.",
            );
        }

        if (clubApplication.status === ClubApplicationStatus.IN_PROGRESS) {
            throw new BadRequestException(
                "해당 유저는 클럽 평가지에 참여할 수없습니다.",
            );
        }

        const clubMatch = await this.clubMatchRepository.findOne({
            where: { id: clubMatchId },
        });

        if (!clubMatch) {
            throw new NotFoundException("해당 경기를 진행하지 않았습니다.");
        }

        const clubMatchHostClub = await this.clubMatchRepository.findOne({
            where: { host_clubId: clubId },
        });

        if (!clubMatchHostClub) {
            throw new BadRequestException(
                "경기를 주관한 클럽은 클럽 평가지를 작성할 수 없습니다.",
            );
        }

        const clubMatchGuestClub = await this.clubMatchRepository.findOne({
            where: { guest_clubId: clubId },
        });

        if (!clubMatchGuestClub) {
            throw new NotFoundException(
                "해당 경기에 참여하지 않은 클럽입니다.",
            );
        }

        const { ...restOfClubscore } = createClubAssessmenttagDto;

        const clubScoreData = await this.clubscoreRepository.save({
            clubId: club.id,
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

    async createClubTag(
        clubMatchId: number,
        clubId: number,
        userId: number,
        clubTagCounterDto: ClubTagCounterDto,
    ) {
        const club = await this.clubRepository.findOne({
            where: { id: clubId },
        });

        if (!club) {
            throw new NotFoundException(
                "해당 클럽은 클럽 태그 작성에 참여할 수 없습니다.",
            );
        }

        const user = await this.userRepository.findOne({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException("해당 유저는 존재하지 않습니다.");
        }

        const clubApplication = await this.clubApplicationRepository.findOne({
            where: { userId: user.id },
        });

        if (
            clubApplication.status === ClubApplicationStatus.BEFORE_APPLICATION
        ) {
            throw new BadRequestException(
                "해당 유저는 클럽 태그 작성에 참여할 수없습니다.",
            );
        }

        if (clubApplication.status === ClubApplicationStatus.IN_PROGRESS) {
            throw new BadRequestException(
                "해당 유저는 클럽 태그 작성에 참여할 수없습니다.",
            );
        }

        const clubMatch = await this.clubMatchRepository.findOne({
            where: { id: clubMatchId },
        });

        if (!clubMatch) {
            throw new NotFoundException("해당 경기를 진행하지 않았습니다.");
        }

        const clubMatchHostClub = await this.clubMatchRepository.findOne({
            where: { host_clubId: clubId },
        });

        if (!clubMatchHostClub) {
            throw new BadRequestException(
                "경기를 주관한 클럽은 클럽 태그를 작성할 수 없습니다.",
            );
        }

        const clubMatchGuestClub = await this.clubMatchRepository.findOne({
            where: { guest_clubId: clubId },
        });

        if (!clubMatchGuestClub) {
            throw new NotFoundException(
                "해당 경기에 참여하지 않은 클럽입니다.",
            );
        }

        const { ...restOfClubtagcounter } = clubTagCounterDto;
        const clubTagData = await this.clubtagcounterRepository.save({
            clubId: club.id,
            ...restOfClubtagcounter,
        });

        return clubTagData;
    }

    async updateClubAssessment(
        clubMatchId: number,
        clubId: number,
        userId: number,
        createClubAssessmenttagDto: CreateClubassessmenttagDto,
    ) {
        const club = await this.clubRepository.findOne({
            where: { id: clubId },
        });

        if (!club) {
            throw new NotFoundException(
                "해당 클럽은 클럽 평가지 작성에 참여할 수 없습니다.",
            );
        }

        const user = await this.userRepository.findOne({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException("해당 유저는 존재하지 않습니다.");
        }

        const clubApplication = await this.clubApplicationRepository.findOne({
            where: { userId: user.id },
        });

        if (
            clubApplication.status === ClubApplicationStatus.BEFORE_APPLICATION
        ) {
            throw new BadRequestException(
                "해당 유저는 클럽 평가지에 참여할 수없습니다.",
            );
        }

        if (clubApplication.status === ClubApplicationStatus.IN_PROGRESS) {
            throw new BadRequestException(
                "해당 유저는 클럽 평가지에 참여할 수없습니다.",
            );
        }

        const clubAssessment = await this.clubscoreRepository.findOne({
            where: { clubId: club.id },
        });
        if (!clubAssessment) {
            throw new NotFoundException("클럽 평가지가 존재하지 않습니다.");
        }

        const clubMatch = await this.clubMatchRepository.findOne({
            where: { id: clubMatchId },
        });

        if (!clubMatch) {
            throw new NotFoundException("해당 경기를 진행하지 않았습니다.");
        }

        const clubMatchHostClub = await this.clubMatchRepository.findOne({
            where: { host_clubId: clubId },
        });

        if (!clubMatchHostClub) {
            throw new BadRequestException(
                "경기를 주관한 클럽은 클럽 평가지를 작성할 수 없습니다.",
            );
        }

        const clubMatchGuestClub = await this.clubMatchRepository.findOne({
            where: { guest_clubId: clubId },
        });

        if (!clubMatchGuestClub) {
            throw new NotFoundException(
                "해당 경기에 참여하지 않은 클럽입니다.",
            );
        }

        const clubAssessmentUserData = await this.clubscoreRepository.findOne({
            where: { clubId: club.id },
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

        const clubAssessmentUser = this.clubscoreRepository.save({
            clubId: club.id,
            clubAssessmentUserData,
        });

        return clubAssessmentUser;
    }

    async updateClubTag(
        clubMatchId: number,
        clubId: number,
        userId: number,
        clubTagCounterDto: ClubTagCounterDto,
    ) {
        const club = await this.clubRepository.findOne({
            where: { id: clubId },
        });

        if (!club) {
            throw new NotFoundException(
                "해당 클럽은 클럽 태그 작성에 참여할 수 없습니다.",
            );
        }

        const user = await this.userRepository.findOne({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException("해당 유저는 존재하지 않습니다.");
        }

        const clubApplication = await this.clubApplicationRepository.findOne({
            where: { userId: user.id },
        });

        if (
            clubApplication.status === ClubApplicationStatus.BEFORE_APPLICATION
        ) {
            throw new BadRequestException(
                "해당 유저는 클럽 태그 작성에 참여할 수없습니다.",
            );
        }

        if (clubApplication.status === ClubApplicationStatus.IN_PROGRESS) {
            throw new BadRequestException(
                "해당 유저는 클럽 태그 작성에 참여할 수없습니다.",
            );
        }

        const clubTag = await this.clubtagcounterRepository.findOne({
            where: { clubId: club.id },
        });
        if (!clubTag) {
            throw new NotFoundException("클럽 태그가 존재하지 않습니다.");
        }

        const clubMatch = await this.clubMatchRepository.findOne({
            where: { id: clubMatchId },
        });

        if (!clubMatch) {
            throw new NotFoundException("해당 경기를 진행하지 않았습니다.");
        }

        const clubMatchHostClub = await this.clubMatchRepository.findOne({
            where: { host_clubId: clubId },
        });

        if (!clubMatchHostClub) {
            throw new BadRequestException(
                "경기를 주관한 클럽은 클럽 태그를 작성할 수 없습니다.",
            );
        }

        const clubMatchGuestClub = await this.clubMatchRepository.findOne({
            where: { guest_clubId: clubId },
        });

        if (!clubMatchGuestClub) {
            throw new NotFoundException(
                "해당 경기에 참여하지 않은 클럽입니다.",
            );
        }

        for (const key in clubTagCounterDto) {
            if (clubTagCounterDto.hasOwnProperty(key) && key !== "clubId") {
                // 해당 key에 대한 값이 숫자이면서 1일 때만 +1 증가
                if (clubTagCounterDto[key] === 1) {
                    clubTag[key] += 1;
                }
            }
        }
        const updatedClubTag = await this.clubtagcounterRepository.save({
            clubId: club.id,
            clubTag,
        });

        return updatedClubTag;
    }
}
