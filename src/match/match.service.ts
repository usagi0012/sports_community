import { UserId } from "./../auth/decorators/userId.decorator";
import { Progress } from "./../entity/match.entity";
import { MatchDTO } from "./dto/match.dto";
import { Match, MatchStatus } from "../entity/match.entity";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Not, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Recruit, Status } from "../entity/recruit.entity";
import { User, UserType } from "./../entity/user.entity";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Alarmservice } from "src/alarm/alarm.service";

const now = new Date();
const utc = now.getTime();
const koreaTimeDiff = 9 * 60 * 60 * 1000;
const korNow = new Date(utc + koreaTimeDiff);

@Injectable()
export class MatchService {
    constructor(
        @InjectRepository(Match)
        private matchRepository: Repository<Match>,
        @InjectRepository(Recruit)
        private recruitRepository: Repository<Recruit>,
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

        // await this.userType(userId);
    }
    //나의 매치 조회
    async getMyMatch(userId: number) {
        const matches = await this.matchRepository.find({
            where: {
                guestId: userId,
            },
        });
        return matches;
    }

    //나의매치 상세조회
    async findMyMatch(matchId: number, userId: number) {
        const findmatch = await this.matchRepository.findOne({
            where: {
                id: matchId,
            },
        });

        if (findmatch.guestId !== userId) {
            throw new NotFoundException(
                `matchid ${matchId}에 대한 권한이 없습니다.`,
            );
        }
        findmatch.updateProgress();
        return findmatch;
    }

    //매치 신청하기
    async postMatch(recruitId: number, userId: number, matchDTO: MatchDTO) {
        await this.userType(userId);

        const findRecruit = await this.recruitRepository.findOne({
            where: {
                id: recruitId,
            },
        });
        if (!findRecruit) {
            throw new NotFoundException(
                `Recruit with id ${recruitId} 을 찾을 수 없습니다.`,
            );
        }

        if (findRecruit.progress !== Progress.BEFORE) {
            throw new NotFoundException("이미 시작한 경기입니다.");
        }

        if (findRecruit.status === Status.Complete) {
            throw new NotFoundException("모집이 완료되었습니다.");
        }

        if (findRecruit.hostId === userId) {
            throw new NotFoundException(
                "본인의 모집 공고에는 신청이 불가합니다.",
            );
        }

        await this.checkMatch(recruitId, userId);
        const user = await this.userRepository.findOne({
            where: {
                id: userId,
            },
        });
        const myMatches = await this.getMyMatch(userId);

        for (const match of myMatches) {
            const matchGamedate = match.gameDate;
            const matchEndtime = match.endTime;

            if (
                findRecruit.gamedate >= matchGamedate &&
                findRecruit.gamedate <= matchEndtime
            ) {
                throw new NotFoundException(
                    "이미 그 시간에 신청한 매치가 있습니다.",
                );
            }
        }

        const recruit = await this.recruitRepository.findOne({
            where: { id: recruitId },
        });
        const submitMatch = this.matchRepository.create({
            gameDate: findRecruit.gamedate,
            endTime: findRecruit.endtime,
            guestId: userId,
            guestName: user.name,
            recruitId: recruitId,
            hostId: recruit.hostId,
            hostName: recruit.hostName,
            recruitTitle: recruit.title,
            gps: recruit.gps,

            ...matchDTO,
        });
        await this.matchRepository.save(submitMatch);

        this.alarmService.sendAlarm(
            recruit.hostId,
            `${user.name}님이 매치를 신청했습니다.`,
        );
        return submitMatch;
    }

    // 신청 취소하기
    async cancelMatch(matchId: number, userId: number) {
        const findmatch = await this.findMyMatch(matchId, userId);

        if (findmatch.guestId !== userId) {
            throw new NotFoundException(
                `matchid ${matchId}에 대한 권한이 없습니다.`,
            );
        }

        if (findmatch.status === MatchStatus.CONFIRM) {
            throw new NotFoundException("컴펀된 경기는 취소할 수 없습니다.");
        }

        findmatch.status = MatchStatus.CANCELCONFIRM;

        return await this.matchRepository.save(findmatch);
    }
    //본인 매치에서 경기한 유저아이디 조회
    async findGameUser(userId: number, matchId: number) {
        const findmatch = await this.findMyMatch(matchId, userId);

        if (!findmatch) {
            throw new NotFoundException(`Match ${matchId}을 찾을 수 없습니다.`);
        }

        const matches = await this.matchRepository.find({
            where: {
                recruitId: findmatch.recruitId,
                status: MatchStatus.CONFIRM,
            },
        });

        return [findmatch, matches];
    }

    //매치 컴펌하기
    async confirmMatch(matchId: number, userId: number) {
        const findMatch = await this.findMyMatch(matchId, userId);

        const recruitId = findMatch.recruitId;

        const recruit = await this.recruitRepository.findOne({
            where: {
                id: recruitId,
            },
        });

        if (findMatch.status === MatchStatus.CONFIRM) {
            throw new NotFoundException("이미 참석하기로한 경기입니다.");
        }

        if (findMatch.status === MatchStatus.APPLICATION_COMPLETE) {
            throw new NotFoundException("처리중입니다.");
        }

        if (findMatch.status === MatchStatus.REJECTED) {
            findMatch.status = MatchStatus.CANCELCONFIRM;

            await this.matchRepository.save(findMatch);
        } else if (findMatch.status === MatchStatus.APPROVED) {
            if (recruit.status === Status.Complete) {
                findMatch.status = MatchStatus.CANCELCONFIRM;
                await this.matchRepository.save(findMatch);
                throw new NotFoundException("모집 완료된 경기입니다.");
            }

            findMatch.status = MatchStatus.CONFIRM;
            recruit.totalmember -= 1;

            if (recruit.totalmember === 0) {
                recruit.status = Status.Complete;
                await this.recruitRepository.save(recruit);

                const anotherMatches = await this.matchRepository.find({
                    where: {
                        recruitId: recruitId,
                        status: Not(
                            MatchStatus.CONFIRM && MatchStatus.CANCELCONFIRM,
                        ),
                    },
                });

                for (const individualMatch of anotherMatches) {
                    individualMatch.status = MatchStatus.CANCELCONFIRM;
                    await this.matchRepository.save(individualMatch);
                }
            }
            await this.recruitRepository.save(recruit);
            await this.matchRepository.save(findMatch);
        }
        return findMatch;
    }

    // 경기 평가완료하기
    async doneGame(userId: number, matchId: number) {
        const findMatch = await this.findMyMatch(matchId, userId);

        const response = await this.findGameUser(userId, matchId);

        if (findMatch.progress === Progress.EVALUATION_COMPLETED) {
            throw new NotFoundException("이미 평가완료하였습니다. ");
        }

        if (findMatch.endTime >= new Date()) {
            throw new NotFoundException("경기가 끝난 후 평가 가능합니다.");
        }

        const matchesArray = response[1] as Match[];

        const matchIds = matchesArray.map((match) => match.guestId);

        const matchUsers = findMatch.evaluateUser;
        if (matchUsers) {
            function evaluateUsers(
                matchUsers: string[],
                matchIds: number[],
            ): void {
                if (!matchUsers) {
                    throw new NotFoundException(
                        "평가하지 않은 인원이 있습니다.",
                    );
                }

                const matchUsersAsInt: number[] = matchUsers.map(Number);

                if (
                    matchUsersAsInt.length !== matchIds.length ||
                    !matchUsersAsInt.every((value) => matchIds.includes(value))
                ) {
                    throw new NotFoundException(
                        "평가하지 않은 인원이 있습니다.",
                    );
                }
            }
            evaluateUsers(matchUsers, matchIds);
        }

        findMatch.evaluate = true;
        findMatch.progress = Progress.EVALUATION_COMPLETED;

        return await this.matchRepository.save(findMatch);
    }
    //컴펌후 삭제하기
    async deleteCancelGame(userId: number, matchId: number) {
        const findMatch = await this.findMyMatch(matchId, userId);

        if (!findMatch) {
            throw new NotFoundException("매치를 찾을 수 없습니다.");
        }

        if (findMatch.progress === Progress.EVALUATION_COMPLETED) {
            return await this.matchRepository.remove(findMatch);
        }

        if (findMatch.status === MatchStatus.CONFIRM) {
            throw new NotFoundException("이미 컴펌한 경기입니다.");
        }

        if (findMatch.status !== MatchStatus.CANCELCONFIRM) {
            throw new NotFoundException("취소 후 삭제할 수 있습니다.");
        }

        return await this.matchRepository.remove(findMatch);
    }

    private async checkMatch(recruitId: number, UserId: number) {
        const matche = await this.matchRepository.findOne({
            where: {
                recruitId: recruitId,
            },
        });
        if (matche && matche.guestId == UserId) {
            throw new NotFoundException("이미 신청하셨습니다.");
        }
    }

    @Cron(CronExpression.EVERY_HOUR)
    async handleCron() {
        const matches = await this.matchRepository.find();

        for (const match of matches) {
            this.updateProgress(match);
            const message = `함께 경기한 사람들을 평가해주세요!`;
            //link부분 수정해야함
            this.alarmService.sendAlarm(match.guestId, message);
        }

        await this.matchRepository.save(matches);
    }

    private updateProgress(match: Match) {
        if (match.gameDate.getTime() < korNow.getTime()) {
            match.progress = Progress.DURING;
        }

        if (match.endTime.getTime() < korNow.getTime()) {
            match.progress = Progress.PLEASE_EVALUATE;
        }

        if (match.gameDate.getTime() < korNow.getTime()) {
            if (match.status !== MatchStatus.CONFIRM) {
                match.progress = Progress.BEFORE;
                match.status = MatchStatus.CANCELCONFIRM;
            }
        }
    }

    //호스트가 매치 삭제하기
    async deleteMatch(userId: number, matchId: number) {
        try {
            const match = await this.matchRepository.findOne({
                where: {
                    id: matchId,
                    hostId: userId,
                },
            });

            if (!match) {
                throw new Error("Match not found");
            }

            const recruitId = match.recruitId;
            const recruit = await this.recruitRepository.findOne({
                where: {
                    id: recruitId,
                },
            });

            if (!recruit) {
                throw new Error("Recruit not found");
            }

            if (match.status === MatchStatus.CONFIRM) {
                recruit.totalmember += 1;
                if (recruit.status === Status.Complete) {
                    recruit.status = Status.Recruiting;
                }
                await this.recruitRepository.save(recruit);
            }

            match.status = MatchStatus.CANCELCONFIRM;
            await this.matchRepository.save(match);

            return { message: "경기가 취소되었습니다." };
        } catch (error) {
            throw new Error(error);
        }
    }

    //유저집어넣기
    async evaluateUser(guestId: number, userId: number, matchId: number) {
        try {
            const myMatch = await this.matchRepository.findOne({
                where: {
                    id: matchId,
                },
            });

            myMatch.evaluateUser = myMatch.evaluateUser || [];

            if (!myMatch.evaluateUser.includes(guestId.toString())) {
                myMatch.evaluateUser.push(guestId.toString());

                return await this.matchRepository.save(myMatch);
            }

            return myMatch;
        } catch (error) {
            throw new NotFoundException(error);
        }
    }
}
