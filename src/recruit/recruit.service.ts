import { error } from "console";
import { User } from "./../entity/user.entity";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Progress, Recruit, Status } from "../entity/recruit.entity";
import { RecruitDTO, UpdateDto, PutDTO } from "./dto/recruit.dto";
import { Not, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Match, MatchStatus } from "../entity/match.entity";
import { MatchUpdateDto } from "./dto/checkmatch.dto";
import { ST } from "next/dist/shared/lib/utils";
import { use } from "passport";
import { Cron, CronExpression } from "@nestjs/schedule";
import { not } from "cheerio/lib/api/traversing";
import { match } from "assert";

@Injectable()
export class RecruitService {
    constructor(
        @InjectRepository(Recruit)
        private recruitRepository: Repository<Recruit>,
        @InjectRepository(Match)
        private matchRepository: Repository<Match>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    //모집 글 등록
    async postRecruit(userId: number, recruitDTO: RecruitDTO) {
        const basicnumber = recruitDTO.totalmember;
        const user = await this.userRepository.findOne({
            where: {
                id: userId,
            },
        });

        const newRecruit = this.recruitRepository.create({
            basictotalmember: basicnumber,
            hostId: userId,
            hostName: user.name,

            ...recruitDTO,
        });

        return await this.recruitRepository.save(newRecruit);
    }

    //모집 글 조회
    async getRecruit() {
        const Recruit = await this.recruitRepository.find({
            select: {
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

        return myRecruits;
    }

    // 내 모집글 상세 조회
    async findMyRecruit(userId: number, recruitId: number) {
        const matches = await this.matchRepository.find({
            where: {
                recruitId: recruitId,
                hostId: userId,
            },
            select: {
                id: true,
                guestId: true,
                guestName: true,
                message: true,
                status: true,
            },
        });
        return matches;
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
        await this.checkHost(hostId, recruitId);

        const matches = await this.matchRepository.find({
            where: {
                recruitId: recruitId,
                status: MatchStatus.CONFIRM,
            },
        });

        if (matches.length === 0) {
            throw new NotFoundException("컴펀한 유저가 없습니다.");
        }

        const users = [];

        for (const match of matches) {
            const guestUser = await this.userRepository.findOne({
                where: {
                    id: match.guestId,
                },
                select: ["id", "name", "club"],
            });
            users.push(guestUser);
        }

        return matches;
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

        if (existingRecruit.progress !== Progress.EVALUATION_COMPLETED) {
            throw new NotFoundException(
                "이미 컴펌된 경기이거나 평가 후 삭제할 수 있습니다. ",
            );
        }

        return await this.recruitRepository.remove(existingRecruit);
    }

    private async findMatch(recruitId: number) {
        const matches = await this.matchRepository.find({
            where: { recruitId: recruitId },
            select: ["id", "message", "guestName"],
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
        const now = new Date();

        if (recruit.gamedate.getTime() < now.getTime()) {
            recruit.progress = Progress.DURING;
        }

        if (recruit.endtime.getTime() < now.getTime()) {
            recruit.progress = Progress.PLEASE_EVALUATE;
        }
    }
}
