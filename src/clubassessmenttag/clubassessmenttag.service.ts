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
import { ClubRank } from "src/entity/clubRank.entity";

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
        @InjectRepository(ClubRank)
        private readonly clubRankRepository: Repository<ClubRank>,
    ) {}

    async findTopThreeClub(): Promise<number[]> {
        const topThreeClubs = await this.clubscoreRepository
            .createQueryBuilder("clubscore")
            .select("clubscore.clubId", "clubId")
            .addSelect(
                "SUM(clubscore.personalityAmount+clubscore.abilityAmount)",
                "totalScore",
            )
            .groupBy("clubscore.clubId")
            .orderBy("totalScore", "DESC")
            .take(3)
            .getRawMany();

        // 상위 3개 동아리 점수 저장
        topThreeClubs.forEach(async (club) => {
            await this.clubRankRepository.save({
                clubId: club.clubId,
                totalScore: club.totalScore,
            });
        });

        const topThreeClubIds = topThreeClubs.map((club) => club.clubId);

        return topThreeClubIds;
    }

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

        /* if (!club) {
            throw new NotFoundException("해당 클럽이 존재하지 않습니다.");
        } */

        const clubTag = await this.clubtagcounterRepository.findOne({
            where: { clubId: club.id },
        });

        /*   if (!clubTag) {
            throw new NotFoundException("클럽의 태그를 찾을 수 없습니다.");
        } */

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

    async updateClubAssessment(
        clubMatchId: number,
        myClubId: number,
        createClubAssessmenttagDto: CreateClubassessmenttagDto,
    ) {
        const club = await this.clubRepository.findOne({
            where: { id: myClubId },
        });

        let hasClubAssessment = await this.clubscoreRepository.findOne({
            where: { clubId: club.id },
        });
        console.log("있는게 맞어??????", hasClubAssessment);
        const clubId = club.id;

        if (!hasClubAssessment) {
            const newClubAssessment = this.createClubAssessment(
                +clubMatchId,
                +clubId,
                createClubAssessmenttagDto,
            );

            return newClubAssessment;
        }

        if (!club) {
            throw new NotFoundException("해당 클럽은 존재하지 않습니다.");
        }

        const clubMatch = await this.clubMatchRepository.findOne({
            where: { id: clubMatchId },
        });

        if (!clubMatch) {
            throw new NotFoundException("해당 경기를 진행하지 않았습니다.");
        }

        // if (clubMatch.status === ClubMatchStatus.APPLICATION_COMPLETE) {
        //     throw new BadRequestException(
        //         "시합 신청완료 상태에서는 평가지를 작성할 수 없습니다.",
        //     );
        // }

        // if (clubMatch.status === ClubMatchStatus.CANCEL) {
        //     throw new BadRequestException(
        //         "시합 취소 상태에서는 평가지를 작성할 수 없습니다.",
        //     );
        // }

        if (clubMatch.status === ClubMatchStatus.REJECTED) {
            throw new BadRequestException(
                "시합 거절 상태에서는 평가지를 작성할 수 없습니다.",
            );
        }

        if (!clubMatch.host_clubId && !clubMatch.guest_clubId) {
            throw new NotFoundException(
                "해당 경기에 참여하지 않은 클럽입니다.",
            );
        }

        if (clubMatch.host_clubId === clubMatch.guest_clubId) {
            throw new BadRequestException(
                "해당 클럽은 평가지를 작성할 수 없습니다.",
            );
        }
        const clubAssessmentUserData = await this.clubscoreRepository.findOne({
            where: { clubId: club.id },
        });

        if (!clubAssessmentUserData) {
            throw new NotFoundException("해당 클럽 평가지를 찾을 수 없습니다.");
        }

        clubAssessmentUserData.count += 1;

        console.log(typeof clubAssessmentUserData.count);

        clubAssessmentUserData.personalityAmount +=
            createClubAssessmenttagDto.personalityAmount;
        clubAssessmentUserData.abilityAmount +=
            createClubAssessmenttagDto.abilityAmount;

        clubAssessmentUserData.personality =
            clubAssessmentUserData.personalityAmount /
            clubAssessmentUserData.count;

        clubAssessmentUserData.ability =
            clubAssessmentUserData.abilityAmount / clubAssessmentUserData.count;

        clubAssessmentUserData.personality = parseFloat(
            clubAssessmentUserData.personality.toFixed(3),
        );

        clubAssessmentUserData.ability = parseFloat(
            clubAssessmentUserData.ability.toFixed(3),
        );

        const clubAssessmentUser = this.clubscoreRepository.save(
            clubAssessmentUserData,
        );

        return clubAssessmentUser;
    }

    async updateClubTag(
        clubMatchId: number,
        myClubId: number,
        clubTagCounterDto: ClubTagCounterDto,
    ) {
        const club = await this.clubRepository.findOne({
            where: { id: myClubId },
        });

        let hasClubTag = await this.clubtagcounterRepository.findOne({
            where: { clubId: club.id },
        });

        const clubId = club.id;

        if (!hasClubTag) {
            const newClubTag = await this.createClubTag(
                +clubMatchId,
                +clubId,
                clubTagCounterDto,
            );

            return newClubTag;
        }

        if (!club) {
            throw new NotFoundException(
                "해당 클럽은 클럽 태그 작성에 참여할 수 없습니다.",
            );
        }

        const clubMatch = await this.clubMatchRepository.findOne({
            where: { id: clubMatchId },
        });

        if (!clubMatch) {
            throw new NotFoundException("해당 경기를 진행하지 않았습니다.");
        }

        // if (clubMatch.status === ClubMatchStatus.APPLICATION_COMPLETE) {
        //     throw new BadRequestException(
        //         "시합 신청완료 상태에서는 태그를 작성할 수 없습니다.",
        //     );
        // }

        // if (clubMatch.status === ClubMatchStatus.CANCEL) {
        //     throw new BadRequestException(
        //         "시합 취소 상태에서는 태그를 작성할 수 없습니다.",
        //     );
        // }

        // if (clubMatch.status === ClubMatchStatus.REJECTED) {
        //     throw new BadRequestException(
        //         "시합 거절 상태에서는 태그를 작성할 수 없습니다.",
        //     );
        // }

        if (!clubMatch.guest_clubId && !clubMatch.host_clubId) {
            throw new NotFoundException(
                "해당 클럽은 태그를 작성할 수 없습니다.",
            );
        }

        if (clubMatch.guest_clubId === clubMatch.host_clubId) {
            throw new BadRequestException(
                "해당 클럽은 태그를 작성할 수 없습니다.",
            );
        }
        console.log("hasClubTag입니다.", hasClubTag);
        for (const key in clubTagCounterDto) {
            if (clubTagCounterDto.hasOwnProperty(key)) {
                // 해당 key에 대한 값이 숫자이면서 1일 때만 +1 증가

                if (clubTagCounterDto[key] === 1) {
                    hasClubTag[key] += 1;
                }
            }
        }
        const updatedClubTag =
            await this.clubtagcounterRepository.save(hasClubTag);

        return updatedClubTag;
    }

    private async createClubAssessment(
        clubMatchId: number,
        clubId: number,
        createClubAssessmenttagDto: CreateClubassessmenttagDto,
    ) {
        console.log("숫자냐?", clubMatchId);
        console.log("숫자냐?", clubId);

        const clubMatch = await this.clubMatchRepository.findOne({
            where: { id: clubMatchId },
        });

        if (!clubMatch) {
            throw new NotFoundException("해당 경기를 진행하지 않았습니다.");
        }

        if (clubMatch.host_clubId === clubMatch.guest_clubId) {
            throw new BadRequestException(
                "해당 클럽은 평가지를 작성할 수 없습니다.",
            );
        }

        if (!clubMatch.host_clubId && !clubMatch.guest_clubId) {
            throw new NotFoundException("해당 클럽은 존재하지 않습니다.");
        }

        if (clubMatch.status === ClubMatchStatus.APPLICATION_COMPLETE) {
            throw new BadRequestException(
                "시합 신청완료 상태에서는 평가지를 작성할 수 없습니다.",
            );
        }

        if (clubMatch.status === ClubMatchStatus.CANCEL) {
            throw new BadRequestException(
                "시합 취소 상태에서는 평가지를 작성할 수 없습니다.",
            );
        }

        if (clubMatch.status === ClubMatchStatus.REJECTED) {
            throw new BadRequestException(
                "시합 거절 상태에서는 평가지를 작성할 수 없습니다.",
            );
        }

        const { ...restOfClubscore } = createClubAssessmenttagDto;

        const clubScoreData = await this.clubscoreRepository.save({
            clubId,
            ...restOfClubscore,
        });

        if (!clubScoreData) {
            throw new NotFoundException("해당 클럽 점수가 없습니다.");
        }

        clubScoreData.count += 1;

        clubScoreData.personality =
            clubScoreData.personalityAmount / clubScoreData.count;

        clubScoreData.ability =
            clubScoreData.abilityAmount / clubScoreData.count;

        clubScoreData.personality = parseFloat(
            clubScoreData.personality.toFixed(3),
        );

        clubScoreData.ability = parseFloat(clubScoreData.ability.toFixed(3));

        const clubScore = await this.clubscoreRepository.save(clubScoreData);

        return clubScore;
    }

    private async createClubTag(
        clubMatchId: number,
        clubId: number,
        clubTagCounterDto: ClubTagCounterDto,
    ) {
        const clubMatch = await this.clubMatchRepository.findOne({
            where: { id: clubMatchId },
        });

        if (!clubMatch) {
            throw new NotFoundException("해당 경기를 진행하지 않았습니다.");
        }

        if (clubMatch.status === ClubMatchStatus.APPLICATION_COMPLETE) {
            throw new BadRequestException(
                "시합 신청완료 상태에서는 태그를 작성할 수 없습니다.",
            );
        }

        if (clubMatch.status === ClubMatchStatus.CANCEL) {
            throw new BadRequestException(
                "시합 취소 상태에서는 태그를 작성할 수 없습니다.",
            );
        }

        if (clubMatch.status === ClubMatchStatus.REJECTED) {
            throw new BadRequestException(
                "시합 거절 상태에서는 태그를 작성할 수 없습니다.",
            );
        }

        if (!clubMatch.host_clubId && !clubMatch.guest_clubId) {
            throw new NotFoundException(
                "해당 경기에 참여하지 않은 클럽입니다.",
            );
        }

        if (clubMatch.host_clubId === clubMatch.guest_clubId) {
            throw new BadRequestException(
                "해당 클럽은 평가지를 작성할 수 없습니다.",
            );
        }

        const { ...restOfClubtagcounter } = clubTagCounterDto;
        const clubTagData = await this.clubtagcounterRepository.save({
            clubId: clubId,
            ...restOfClubtagcounter,
        });

        return clubTagData;
    }
}
