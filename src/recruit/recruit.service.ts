import { User } from "./../entity/user.entity";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Progress, Recruit, Status } from "../entity/recruit.entity";
import { RecruitDTO, UpdateDto, PutDTO } from "./dto/recruit.dto";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Match, MatchStatus } from "../entity/match.entity";
import { MatchUpdateDto } from "./dto/checkmatch.dto";
import { ST } from "next/dist/shared/lib/utils";

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

        const newRecruit = this.recruitRepository.create({
            basictotalmember: basicnumber,
            hostId: userId,

            ...recruitDTO,
        });

        await this.recruitRepository.save(newRecruit);

        return {
            message: "모집글이 등록되었습니다.",
        };
    }

    //모집 글 조회
    async getRecruit() {
        const Recruit = await this.recruitRepository.find();

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
        });

        for (const myRecruit of myRecruits) {
            const recruit = myRecruit;
            await this.updateProgress(recruit);
        }

        return await this.recruitRepository.save(myRecruits);
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
            throw new NotFoundException("없는 모집글입니다");
        }

        const match = await this.matchRepository.findOne({
            where: {
                recruitId: recruitId,
            },
        });

        const data = { myRecruit, match };

        return data;
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
        const match = await this.checkMatch(userId, matchId);

        const recruitId = match.recruitId;

        const recruit = await this.recruitRepository.findOne({
            where: {
                id: recruitId,
                hostId: userId,
            },
        });

        if (matchUpdateDto.status === MatchStatus.APPROVED) {
            match.status = MatchStatus.APPROVED;
            recruit.totalmember -= 1;

            if (recruit.totalmember === 0) {
                recruit.status = Status.Complete;
                await this.recruitRepository.save(recruit);

                const anotherMatches = await this.matchRepository.find({
                    where: {
                        recruitId: match.recruitId,
                        status: MatchStatus.APPLICATION_COMPLETE,
                    },
                });

                for (const individualMatch of anotherMatches) {
                    individualMatch.status = MatchStatus.REJECTED;
                    await this.matchRepository.save(individualMatch);
                }
            }
        } else if (matchUpdateDto.status === MatchStatus.REJECTED) {
            if (match.status === MatchStatus.APPROVED) {
                recruit.totalmember += 1;
                await this.recruitRepository.save(recruit);
            }
            match.status = MatchStatus.REJECTED;
        }

        await this.recruitRepository.save(recruit);
        const updatedMatch = await this.matchRepository.save(match);

        return updatedMatch;
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

        return users;
    }

    // 평가 완료하기
    async evaluateGame(userId: number, recurtId: number) {
        const hostId = userId;
        const recruit = await this.checkHost(hostId, recurtId);

        if (recruit.progress !== Progress.PLEASE_EVALUATE) {
            throw new NotFoundException("경기가 끝난 후에 평가 가능합니다.");
        }

        recruit.progress = Progress.EVALUATION_COMPLETED;

        console.log(recruit.progress);

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
        await this.recruitRepository.delete({ id: recruitId });
        return {
            message: "모집글이 삭제되었습니다.",
        };
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

    private updateProgress(recruit: Recruit) {
        const now = new Date();

        console.log(recruit.gamedate);
        console.log(now);
        console.log(recruit.endtime);

        if (recruit.gamedate.getTime() < now.getTime()) {
            recruit.progress = Progress.DURING;
        }

        if (recruit.endtime.getTime() < now.getTime()) {
            recruit.progress = Progress.PLEASE_EVALUATE;
        }
    }
}
