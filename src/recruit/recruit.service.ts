import { Recruit } from "./../entity/recruit.entity";
import { error } from "console";
import { User } from "./../entity/user.entity";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Progress, Status } from "../entity/recruit.entity";
import { RecruitDTO, UpdateDto, PutDTO } from "./dto/recruit.dto";
import { In, Not, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Match, MatchStatus } from "../entity/match.entity";
import { MatchUpdateDto } from "./dto/checkmatch.dto";
import { use } from "passport";
import { Cron, CronExpression } from "@nestjs/schedule";
import { not } from "cheerio/lib/api/traversing";
import { match } from "assert";
import { Alarmservice } from "src/alarm/alarm.service";

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

            const endtimeDate = Recruit.setEndTimeFromNumber(
                recruitDTO.gamedate,
                recruitDTO.endtime,
            );

            const gameDate = Recruit.korGameDate(recruitDTO.gamedate);

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

            return {
                message: "모집글이 등록되었습니다.",
                newRecruit,
            };
        } catch (error) {
            console.error(error);
            throw new Error("모집글 등록 중 오류가 발생했습니다.");
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

        console.log(myMatches);

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
                console.log(match);
                this.alarmService.sendAlarm(
                    match.guestId,
                    `${recruit.title}에 대한 매치 신청이 승인되었습니다.`,
                );
            } else if (matchUpdateDto.status === MatchStatus.REJECTED) {
                match.status = MatchStatus.REJECTED;
            }

            await this.recruitRepository.save(recruit);
            const updatedMatch = await this.matchRepository.save(match);

            console.log(match.guestId);
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

        if (recruit.progress === Progress.EVALUATION_COMPLETED) {
            throw new NotFoundException("이미평가를 완료하였습니다.");
        }

        if (recruit.progress !== Progress.PLEASE_EVALUATE) {
            throw new NotFoundException("경기가 끝난 후에 평가 가능합니다.");
        }

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
        newGameDate.setHours(existingRecruit.gamedate.getHours() - 1);

        if (existingRecruit.progress === Progress.EVALUATION_COMPLETED) {
            return await this.recruitRepository.remove(existingRecruit);
        }

        if (newGameDate < oneHoursAgo) {
            throw new NotFoundException(
                "1시간전부터는 취소 할 수 없습니다. 경기가 끝난 후 평가해주세요.",
            );
        }

        const myMatches = await this.findConfirmMatch(recruitId);

        console.log(myMatches);
        for (const myMatch of myMatches) {
            const matchUserId = myMatch.guestId;
            console.log(matchUserId);
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

    @Cron(CronExpression.EVERY_HOUR)
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
            console.error(error);
        }
    }
}
