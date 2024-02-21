import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import {
    ChangeTimeDTO,
    CheckClubMatchDTO,
    ClubMatchDTO,
} from "./dto/club_match.dto";
import { ClubMatch, Progress } from "../entity/club_match.entity";
import { Club } from "../entity/club.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ClubMatchStatus } from "../entity/club_match.entity";
import { Alarmservice } from "src/alarm/alarm.service";
import { ConfigService } from "@nestjs/config";
import { User, UserType } from "../entity/user.entity";

const now = new Date();
const utc = now.getTime();
const koreaTimeDiff = 9 * 60 * 60 * 1000;
const korNow = new Date(utc + koreaTimeDiff);

@Injectable()
export class ClubMatchService {
    constructor(
        @InjectRepository(ClubMatch)
        private clubMatchRepository: Repository<ClubMatch>,
        @InjectRepository(Club)
        private clubRepository: Repository<Club>,
        private readonly alarmService: Alarmservice,
        private readonly configService: ConfigService,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    private async userType(UserId: number) {
        const me = await this.userRepository.findOne({
            where: { id: UserId },
        });

        if (!me) {
            throw new NotFoundException("유저를 찾을 수 없습니다.");
        }

        if (
            me.userType === UserType.BANNED_USER ||
            me.userType !== UserType.PERMANENT_BAN
        ) {
            throw new NotFoundException("밴유저는 이용 불가능합니다.");
        }
    }
    //매치 신청하기

    async postClubMatch(
        id: number,
        userId: number,
        clubMatchDTO: ClubMatchDTO,
    ) {
        await this.userType(userId);

        const { endTime, gameDate, ...restclubMatchDTO } = clubMatchDTO;
        const guestClub = await this.clubRepository.findOne({
            where: {
                masterId: userId,
            },
        });

        if (!guestClub) {
            throw new NotFoundException(
                "동아리가 없거나 동아리장만 신청할 수 있습니다.",
            );
        }

        const endtimeDate = ClubMatch.setEndTimeFromNumber(
            clubMatchDTO.gameDate,
            clubMatchDTO.endTime,
        );

        const gamedate = ClubMatch.korGameDate(clubMatchDTO.gameDate);

        const hostClub = await this.clubRepository.findOne({
            where: {
                id: id,
            },
        });

        const oneHourBeforeNow = new Date(
            korNow.getTime() + 1 * 60 * 60 * 1000,
        );

        if (gamedate.getTime() < oneHourBeforeNow.getTime()) {
            throw new NotFoundException("최소 한 시간 전에 입력 가능합니다.");
        }

        const newMatch = this.clubMatchRepository.create({
            host_clubId: id,
            host_clubId_master: hostClub.masterId,
            host_club_name: hostClub.name,
            guest_clubId: guestClub.id,
            guest_clubId_master: userId,
            guest_club_name: guestClub.name,
            guestClub: guestClub,
            hostClub: hostClub,
            gameDate: gamedate,
            endTime: endtimeDate,

            ...restclubMatchDTO,
        });
        const link = `${this.configService.get("LOCALHOSt_URL")}/index.html`;
        this.alarmService.sendAlarm(
            hostClub.masterId,
            `${guestClub.name}동아리에게 매치 신청이 왔습니다.`,
            link,
        );
        return await this.clubMatchRepository.save(newMatch);
    }

    //host매치 조회하기
    async getHostMatch(userId: number) {
        const matches = await this.clubMatchRepository.find({
            where: {
                host_clubId_master: userId,
            },
            select: {
                id: true,
                host_club_name: true,
                guest_club_name: true,
                message: true,
                information: true,
                status: true,
                gameDate: true,
                endTime: true,
                progress: true,
            },
        });
        for (const match of matches) {
            this.updateProgress(match);
        }

        return await this.clubMatchRepository.save(matches);
    }

    //호스트 매치 상세조회
    async findHostMatch(id: number, userId: number) {
        const match = await this.clubMatchRepository.findOne({
            where: {
                id: id,
                host_clubId_master: userId,
            },
            relations: {
                guestClub: true,
            },
        });

        if (!match) {
            throw new NotFoundException(`Match ${id}을 찾을 수 없습니다.`);
        }
        this.updateProgress(match);
        return match;
    }

    //호스트 유저 조회
    async findHostMatchUser(id: number, userId: number) {
        const match = await this.clubMatchRepository.findOne({
            where: {
                id: id,
                host_clubId_master: userId,
            },
            relations: {
                guestClub: true,
            },
        });

        if (!match) {
            throw new NotFoundException(`Match ${id}을 찾을 수 없습니다.`);
        }

        const guestClub = match.guestClub;

        return [match, guestClub];
    }
    //host매치 승인/거절하기
    async putHostMatch(
        id: number,
        userId: number,
        checkClubMatchDTO: CheckClubMatchDTO,
    ) {
        const match = await this.clubMatchRepository.findOne({
            where: {
                id: id,
                host_clubId_master: userId,
            },
        });

        if (!match) {
            throw new NotFoundException(`Match ${id}을 찾을 수 없습니다.`);
        }

        if (
            match.status === ClubMatchStatus.CANCEL ||
            match.status === ClubMatchStatus.MATCHSUCCESS
        ) {
            throw new NotFoundException(
                "이미 컴펌된 경기입니다. 수정이 불가능합니다.",
            );
        }

        match.status = checkClubMatchDTO.status;

        this.alarmService.sendAlarm(
            match.guest_clubId_master,
            `${match.host_club_name}동아리와 매치가 성사되었습니다.`,
        );

        return await this.clubMatchRepository.save(match);
    }
    //host 경기 시간 변경하기
    async changeTime(id: number, userId: number, changeTimeDTO: ChangeTimeDTO) {
        const clubMatch = await this.findHostMatch(id, userId);

        if (!clubMatch) {
            throw new NotFoundException("조회되는 클럽 매치가 없습니다.");
        }

        clubMatch.gameDate = changeTimeDTO.gameDate;
        clubMatch.endTime = changeTimeDTO.endTime;

        return await this.clubMatchRepository.save(clubMatch);
    }

    //host 컴펌하기
    async confirmHost(id: number, userId: number) {
        const clubMatch = await this.findHostMatch(id, userId);

        if (!clubMatch) {
            throw new NotFoundException("조회되는 클럽 매치가 없습니다.");
        }

        if (clubMatch.status === ClubMatchStatus.REJECTED) {
            clubMatch.status = ClubMatchStatus.CANCEL;
        } else if (clubMatch.status === ClubMatchStatus.APPROVED) {
            clubMatch.status = ClubMatchStatus.APPROVECONFIRM;
        } else if (clubMatch.status === ClubMatchStatus.APPLICATION_COMPLETE) {
            throw new NotFoundException("승인/거절 후 컴펌해주세요 ");
        }

        return await this.clubMatchRepository.save(clubMatch);
    }

    //host 경기 평가 완료하기
    async evaluateHost(id: number, userId: number) {
        const clubMatch = await this.findHostMatch(id, userId);

        if (!clubMatch) {
            throw new NotFoundException("조회되는 클럽 매치가 없습니다.");
        }

        if (clubMatch.progress !== Progress.PLEASE_EVALUATE) {
            throw new BadRequestException(
                `경기 종료시간 ${clubMatch.endTime}이 지나야 가능합니다.`,
            );
        }

        clubMatch.host_evaluate = true;

        return await this.clubMatchRepository.save(clubMatch);
    }

    //guest매치 조회하기
    async getGuestMatch(userId: number) {
        const matches = await this.clubMatchRepository.find({
            where: {
                guest_clubId_master: userId,
            },
            select: {
                id: true,
                guest_club_name: true,
                host_club_name: true,
                message: true,
                information: true,
                status: true,
                progress: true,
                endTime: true,
                gameDate: true,
            },
        });

        for (const match of matches) {
            this.updateProgress(match);
        }

        return await this.clubMatchRepository.save(matches);
    }

    //guest매치 상세조회
    async findGuestMatch(id: number, userId: number) {
        const guestMatch = await this.clubMatchRepository.findOne({
            where: {
                id: id,
                guest_clubId_master: userId,
            },
        });

        if (!guestMatch) {
            throw new NotFoundException(`Match ${id}을 찾을 수 없습니다.`);
        }

        this.updateProgress(guestMatch);

        return await this.clubMatchRepository.save(guestMatch);
    }

    //guest매치 호스트유저조회
    async findHostClub(id: number, userId: number) {
        const guestMatch = await this.clubMatchRepository.findOne({
            where: {
                id: id,
                guest_clubId_master: userId,
            },
            relations: {
                hostClub: true,
            },
        });

        if (!guestMatch) {
            throw new NotFoundException(`Match ${id}을 찾을 수 없습니다.`);
        }

        await this.clubMatchRepository.save(guestMatch);

        const hostClub = guestMatch.hostClub;

        return [guestMatch, hostClub];
    }

    //Guest 매치 취소하기
    async cancelGuestMatch(id: number, userId: number) {
        const match = await this.clubMatchRepository.findOne({
            where: {
                id: id,
                guest_clubId_master: userId,
            },
        });

        if (!match) {
            throw new NotFoundException(`매치 ${id}을 찾을 수 없습니다.`);
        }

        if (match.status === ClubMatchStatus.MATCHSUCCESS) {
            throw new NotFoundException("성사된 경기는 취소할 수 없습니다.");
        }
        match.status = ClubMatchStatus.CANCEL;

        return await this.clubMatchRepository.save(match);
    }
    //guest 경기 평가 완료하기
    async evaluateGuest(id: number, userId: number) {
        const guestMatch = await this.findGuestMatch(id, userId);
        if (!guestMatch) {
            throw new NotFoundException("조회되는 매치가 없습니다.");
        }
        if (guestMatch.progress !== Progress.PLEASE_EVALUATE) {
            throw new NotFoundException(
                `경기 종료시간 ${guestMatch.endTime}이 지나야 가능합니다.`,
            );
        }

        guestMatch.guest_evaluate = true;
        return await this.clubMatchRepository.save(guestMatch);
    }

    //취소된 경기 삭제하기
    async deleteClubMatch(id: number, userId: number) {
        const match = await this.clubMatchRepository.findOne({
            where: {
                id: id,
            },
        });

        if (!match) {
            throw new NotFoundException(`Match ${id}을 찾을 수 없습니다.`);
        }

        if (
            match.guest_clubId_master !== userId &&
            match.host_clubId_master !== userId
        ) {
            throw new NotFoundException("권한이 없습니다.");
        }
        if (match.progress === Progress.PLEASE_EVALUATE) {
            if (match.guest_evaluate == true && match.host_evaluate == true) {
                return await this.clubMatchRepository.remove(match);
            } else {
                throw new NotFoundException(
                    "두클럽 모두 평가 후에 삭제 가능합니다. 상대 클럽의 평가를 기다려주세요",
                );
            }
        }

        if (match.status !== ClubMatchStatus.CANCEL) {
            throw new NotFoundException("취소되지 않은 경기입니다.");
        }

        return await this.clubMatchRepository.remove(match);
    }
    // Guest 컴펌하기

    async confirmGuest(id: number, userId: number) {
        const clubMatch = await this.findGuestMatch(id, userId);

        if (!clubMatch) {
            throw new NotFoundException("조회되는 클럽 매치가 없습니다.");
        }

        if (clubMatch.status === ClubMatchStatus.MATCHSUCCESS) {
            throw new BadRequestException("이미 컴펌된 경기입니다.");
        }

        if (clubMatch.status === ClubMatchStatus.CANCEL) {
            throw new BadRequestException("이미 취소된 경기입니다.");
        }

        if (
            clubMatch.status === ClubMatchStatus.APPLICATION_COMPLETE ||
            clubMatch.status === ClubMatchStatus.APPROVED
        ) {
            throw new BadRequestException("호스트의 승인을 기다려주세요");
        }

        if (clubMatch.status === ClubMatchStatus.REJECTED) {
            clubMatch.status = ClubMatchStatus.CANCEL;
        } else if (clubMatch.status === ClubMatchStatus.APPROVECONFIRM) {
            clubMatch.status = ClubMatchStatus.MATCHSUCCESS;
        }

        return await this.clubMatchRepository.save(clubMatch);
    }
    // 클럽평가 변경하기
    async putEvaluate(id: number, userId: number) {
        const clubMatch = await this.clubMatchRepository.findOne({
            where: {
                id: id,
            },
        });

        if (!clubMatch) {
            throw new NotFoundException("클럽 매치를 찾을 수 없습니다.");
        }

        if (clubMatch.guest_clubId_master === userId) {
            clubMatch.guest_evaluate = true;
        } else if (clubMatch.host_clubId_master === userId) {
            clubMatch.host_evaluate = true;
        }
        return await this.clubMatchRepository.save(clubMatch);
    }

    private updateProgress(clubMatch: ClubMatch) {
        if (clubMatch.gameDate.getTime() < korNow.getTime()) {
            clubMatch.progress = Progress.DURING;
        }

        if (clubMatch.endTime.getTime() < korNow.getTime()) {
            clubMatch.progress = Progress.PLEASE_EVALUATE;
        }

        if (clubMatch.gameDate.getTime() < korNow.getTime()) {
            if (clubMatch.status !== ClubMatchStatus.MATCHSUCCESS) {
                clubMatch.progress = Progress.BEFORE;
                clubMatch.status = ClubMatchStatus.CANCEL;
            }
        }
    }
}
