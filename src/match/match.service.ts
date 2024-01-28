import { Progress } from "./../entity/match.entity";
import { MatchDTO } from "./dto/match.dto";
import { Match, MatchStatus } from "../entity/match.entity";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Not, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Recruit, Status } from "../entity/recruit.entity";
import { User } from "./../entity/user.entity";
import { userInfo } from "os";
import { find } from "lodash";

@Injectable()
export class MatchService {
    constructor(
        @InjectRepository(Match)
        private matchRepository: Repository<Match>,
        @InjectRepository(Recruit)
        private recruitRepository: Repository<Recruit>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

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
        if (findRecruit.status === Status.Complete) {
            throw new NotFoundException("모집이 완료되었습니다.");
        }

        await this.checkMatch(recruitId, userId);
        const user = await this.userRepository.findOne({
            where: {
                id: userId,
            },
        });

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

        if (!matches || matches.length === 0) {
            throw new NotFoundException("컴펌된 유저가 없습니다.");
        }

        const users = [];

        for (const match of matches) {
            users.push(match.guestId, match.guestName, match);
        }

        return users;
    }

    //매치 컴펌하기
    async confirmMatch(matchId: number, userId: number) {
        const findMatch = await this.findMyMatch(matchId, userId);

        const recruitId = findMatch.recruitId;

        const recruit = await this.recruitRepository.findOne({
            where: {
                id: recruitId,
                hostId: userId,
            },
        });

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
            await this.matchRepository.save(findMatch);
        }
        return findMatch;
    }

    // 경기 평가완료하기
    async doneGame(userId: number, matchId: number) {
        const findMatch = await this.findMyMatch(matchId, userId);

        if (findMatch.endTime >= new Date()) {
            throw new NotFoundException("경기가 끝난 후 평가 가능합니다.");
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
}
