import { Recruit } from "./../entity/recruit.entity";
import { User } from "./../entity/user.entity";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Progress, Status } from "../entity/recruit.entity";
import { RecruitDTO, UpdateDto, PutDTO } from "./dto/recruit.dto";
import { In, Not, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Match, MatchStatus } from "../entity/match.entity";
import { MatchUpdateDto } from "./dto/checkmatch.dto";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Alarmservice } from "src/alarm/alarm.service";
import { UserType } from "./../entity/user.entity";

const now = new Date();
const utc = now.getTime();
const koreaTimeDiff = 9 * 60 * 60 * 1000;
const korNow = new Date(utc + koreaTimeDiff);
const oneHoursAgo = new Date(korNow);

oneHoursAgo.setHours(korNow.getHours() - 1);

@Injectable()
export class RecruitService {
    constructor(
        @InjectRepository(Recruit)
        private recruitRepository: Repository<Recruit>,
        @InjectRepository(Match)
        private matchRepository: Repository<Match>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private alarmService: Alarmservice,
    ) {}

    private async userType(UserId: number) {
        const me = await this.userRepository.findOne({
            where: { id: UserId },
        });

        if (!me) {
            throw new NotFoundException("유저를 찾을 수 없습니다.");
        }

        if (me.userType === UserType.USER || me.userType !== UserType.ADMIN) {
            throw new NotFoundException("밴유저는 이용 불가능합니다.");
        }
    }

    //모집 글 등록
    async postRecruit(userId: number, recruitDTO: RecruitDTO) {
        try {
            const { endtime, gamedate, totalmember, ...restRecruitDTO } =
                recruitDTO;
            const user = await this.userRepository.findOne({
                where: {
                    id: userId,
                },
            });

            await this.userType(userId);

            const endtimeDate = Recruit.setEndTimeFromNumber(
                recruitDTO.gamedate,
                recruitDTO.endtime,
            );

            const gameDate = Recruit.korGameDate(recruitDTO.gamedate);
            const oneHourBeforeNow = new Date(
                now.getTime() + 1 * 60 * 60 * 1000,
            );

            if (recruitDTO.gamedate.getTime() < oneHourBeforeNow.getTime()) {
                throw new NotFoundException(
                    "최소 한 시간 전에 입력 가능합니다.",
                );
            }

            if (recruitDTO.totalmember > 20) {
                throw new NotFoundException("최대인원 20명을 초과하셨습니다.");
            }

            if (recruitDTO.endtime > 8) {
                throw new NotFoundException(
                    "최대인원 런닝탐임 8시간을 초과하셨습니다.",
                );
            }
            const totalMember = recruitDTO.totalmember - 1;
            const newRecruit = this.recruitRepository.create({
                basictotalmember: recruitDTO.totalmember,
                hostId: userId,
                hostName: user.name,
                gamedate: gameDate,
                endtime: endtimeDate,
                totalmember: totalMember,
                ...restRecruitDTO,
            });

            await this.recruitRepository.save(newRecruit);

            return newRecruit;
        } catch (error) {
            throw new NotFoundException(error);
        }
    }

    //모집 글 조회
    async getRecruit() {
        const Recruit = await this.recruitRepository.find({
            select: {
                id: true,
                hostId: true,
                hostName: true,
                title: true,
                region: true,
                rule: true,
                gamedate: true,
                endtime: true,
                totalmember: true,
                status: true,
            },
            order: { id: "DESC" },
        });

        return Recruit;
    }

    //모집 글 상세조회
    async findRecruit(recruitId: number) {
        const findRecruit = await this.recruitRepository.findOne({
            where: {
                id: recruitId,
            },
        });

        return findRecruit;
    }

    // 내 모집글
    async myRecruit(userId: number) {
        const myRecruits = await this.recruitRepository.find({
            where: {
                hostId: userId,
            },
            select: {
                id: true,
                hostId: true,
                hostName: true,
                title: true,
                region: true,
                rule: true,
                gamedate: true,
                endtime: true,
                totalmember: true,
                status: true,
            },
        });
        for (const myRecruit of myRecruits) {
            this.updateProgress(myRecruit);
        }

        return myRecruits;
    }

    // 내 모집글 상세 조회
    async findMyRecruit(userId: number, recruitId: number) {
        const myRecruit = await this.recruitRepository.findOne({
            where: {
                id: recruitId,
                hostId: userId,
            },
        });

        if (!myRecruit) {
            throw new NotFoundException("내 모집글을 조회하지 못했습니다.");
        }

        this.updateProgress(myRecruit);

        const myMatches = await this.findConfirmMatch(recruitId);

        const matches = await this.matchRepository.find({
            where: {
                recruitId: recruitId,
                hostId: userId,
                status: In([
                    MatchStatus.APPLICATION_COMPLETE,
                    MatchStatus.APPROVED,
                    MatchStatus.REJECTED,
                ]),
            },
        });

        return [myRecruit, matches];
    }

    // 모집글 매치 상세조회
    async checkMatch(userId: number, matchId: number) {
        const match = await this.matchRepository.findOne({
            where: {
                id: matchId,
                hostId: userId,
            },
        });

        if (!match) {
            throw new NotFoundException("매치가 없습니다.");
        }

        if (match.hostId !== userId) {
            throw new NotFoundException("권한이 없습니다.");
        }

        return match;
    }

    // 모집글 승인/거절
    async putMatch(
        userId: number,
        matchUpdateDto: MatchUpdateDto,
        matchId: number,
    ) {
        try {
            const match = await this.checkMatch(userId, matchId);

            const recruitId = match.recruitId;

            const recruit = await this.recruitRepository.findOne({
                where: {
                    id: recruitId,
                    hostId: userId,
                },
            });

            if (match.status === MatchStatus.CONFIRM) {
                throw new NotFoundException("컴펀된 매치입니다.");
            }
            if (recruit.status === Status.Complete) {
                throw new NotFoundException("모집이 완료된 모집글입니다.");
            }

            if (matchUpdateDto.status === MatchStatus.APPROVED) {
                match.status = MatchStatus.APPROVED;

                this.alarmService.sendAlarm(
                    match.guestId,
                    `${recruit.title}에 대한 매치 신청이 승인되었습니다.`,
                );
            } else if (matchUpdateDto.status === MatchStatus.REJECTED) {
                match.status = MatchStatus.REJECTED;
            }

            await this.recruitRepository.save(recruit);
            const updatedMatch = await this.matchRepository.save(match);

            return updatedMatch;
        } catch (error) {
            throw error;
        }
    }

    //본인 모집글 참석 컴펌한 유저 조회
    async getGameUser(userId: number, recruitId: number) {
        const hostId = userId;
        const findRecruit = await this.checkHost(hostId, recruitId);
        if (!findRecruit) {
            throw new NotFoundException("조회된 매치가 없습니다.");
        }

        const matches = await this.matchRepository.find({
            where: {
                recruitId: recruitId,
                status: MatchStatus.CONFIRM,
            },
        });

        if (!matches) {
            throw new NotFoundException("조회된 매치가 없습니다.");
        }

        return [findRecruit, matches];
    }

    // 평가 완료하기
    async evaluateGame(userId: number, recurtId: number) {
        const hostId = userId;
        const recruit = await this.checkHost(hostId, recurtId);

        const response = await this.getGameUser(userId, recurtId);

        const matchesArray = response[1] as Match[];

        const matchIds = matchesArray.map((match) => match.guestId);

        const recruitUsers = recruit.evaluateUser;
        if (recruitUsers) {
            function evaluateUsers(
                recruitUsers: string[],
                matchIds: number[],
            ): void {
                // 문자열 배열을 숫자 배열로 변환
                const recruitUsersAsInt: number[] = recruitUsers.map(Number);

                // 배열의 길이와 값이 일치하는지 확인
                if (
                    recruitUsersAsInt.length !== matchIds.length ||
                    !recruitUsersAsInt.every((value) =>
                        matchIds.includes(value),
                    )
                ) {
                    throw new NotFoundException(
                        "평가하지 않은 인원이 있습니다.",
                    );
                }
            }

            evaluateUsers(recruitUsers, matchIds);
        }

        recruit.evaluateUser;
        if (recruit.progress === Progress.EVALUATION_COMPLETED) {
            throw new NotFoundException("이미평가를 완료하였습니다.");
        }

        if (recruit.progress !== Progress.PLEASE_EVALUATE) {
            throw new NotFoundException("경기가 끝난 후에 평가 가능합니다.");
        }
        recruit.evaluateUser;

        recruit.progress = Progress.EVALUATION_COMPLETED;

        await this.recruitRepository.update(
            { id: recruit.id },
            { progress: recruit.progress },
        );

        return recruit;
    }

    //모집 글 삭제
    async deleteRecruit(hostId: number, recruitId: number) {
        const existingRecruit = await this.recruitRepository.findOne({
            where: {
                id: recruitId,
            },
        });
        if (!existingRecruit) {
            throw new NotFoundException(
                `ID가 ${recruitId}인 리크루트를 찾을 수 없습니다.`,
            );
        }
        await this.checkHost(hostId, recruitId);
        const newGameDate = new Date(existingRecruit.gamedate);
        const ENDDATE = new Date(existingRecruit.endtime);
        newGameDate.setHours(existingRecruit.gamedate.getHours() - 1);
        ENDDATE.setHours(existingRecruit.endtime.getHours());
        if (existingRecruit.progress === Progress.EVALUATION_COMPLETED) {
            return await this.recruitRepository.remove(existingRecruit);
        }

        console.log("newGameDate", newGameDate);
        console.log("korNow", korNow);
        console.log("ENDTIME", ENDDATE);

        if (newGameDate < korNow && korNow < ENDDATE) {
            throw new NotFoundException(
                "1시간전부터는 취소 할 수 없습니다. 경기가 끝난 후 평가해주세요.",
            );
        }

        const myMatches = await this.findConfirmMatch(recruitId);

        for (const myMatch of myMatches) {
            const matchUserId = myMatch.guestId;

            this.alarmService.sendAlarm(
                matchUserId,
                `${existingRecruit.title} 경기가 취소되었습니다.`,
            );

            myMatch.status = MatchStatus.CANCELCONFIRM;
            await this.matchRepository.save(myMatch);
        }

        if (existingRecruit.progress === Progress.BEFORE) {
            return await this.recruitRepository.remove(existingRecruit);
        }
        await this.recruitRepository.delete({ id: recruitId });
        return {
            message: "모집글이 삭제되었습니다.",
        };
    }

    private async findConfirmMatch(recruitId: number) {
        const matches = await this.matchRepository.find({
            where: { recruitId: recruitId, status: MatchStatus.CONFIRM },
        });

        return matches;
    }
    private async checkHost(hostid: number, id: number) {
        const checkrecruit = await this.recruitRepository.findOne({
            where: {
                id: id,
            },
        });

        if (!checkrecruit || checkrecruit.hostId !== hostid) {
            throw new NotFoundException("호스트가 아닙니다.");
        }

        return checkrecruit;
    }

    @Cron(CronExpression.EVERY_10_MINUTES)
    async handleCron() {
        const recruits = await this.recruitRepository.find();

        for (const recruit of recruits) {
            this.updateProgress(recruit);
        }

        await this.recruitRepository.save(recruits);
    }

    private updateProgress(recruit: Recruit) {
        if (recruit.gamedate.getTime() > korNow.getTime()) {
            recruit.progress = Progress.DURING;
        }

        if (recruit.endtime.getTime() < korNow.getTime()) {
            recruit.progress = Progress.PLEASE_EVALUATE;
        }
    }

    async editMatch(userId: number, putDTO: PutDTO, recruitId: number) {
        try {
            const myRecruit = await this.recruitRepository.findOne({
                where: {
                    id: recruitId,
                    hostId: userId,
                },
            });

            const endtimeDate = Recruit.setEndTimeFromNumber(
                putDTO.gamedate,
                putDTO.endtime,
            );

            const gameDate = Recruit.korGameDate(putDTO.gamedate);

            if (myRecruit) {
                myRecruit.title = putDTO.title || myRecruit.title;
                myRecruit.region = putDTO.region || myRecruit.region;
                myRecruit.gps = putDTO.gps || myRecruit.gps;
                myRecruit.content = putDTO.content || myRecruit.content;
                myRecruit.gamedate = gameDate || myRecruit.gamedate;

                myRecruit.endtime = endtimeDate || myRecruit.endtime;

                myRecruit.rule = putDTO.rule || myRecruit.rule;
                myRecruit.totalmember =
                    putDTO.totalmember || myRecruit.totalmember;

                await this.recruitRepository.save(myRecruit);

                return myRecruit;
            } else {
                throw new NotFoundException("모집글이 존재하지 않습니다.");
            }
        } catch (error) {
            console.log("error", error);
            throw new NotFoundException(error);
        }
    }
    //유저집어넣기
    async evaluateUser(guestId: number, userId: number, recruitId: number) {
        try {
            const myRecruit = await this.recruitRepository.findOne({
                where: {
                    id: recruitId,
                },
            });
            myRecruit.evaluateUser = myRecruit.evaluateUser || [];

            if (!myRecruit.evaluateUser.includes(guestId.toString())) {
                myRecruit.evaluateUser.push(guestId.toString());

                return await this.recruitRepository.save(myRecruit);
            }

            return myRecruit;
        } catch (error) {
            console.log("error", error);
            throw new NotFoundException(error);
        }
    }
}
