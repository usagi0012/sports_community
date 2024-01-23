import { Progress } from "./../entity/match.entity";
import { MatchDTO } from "./dto/match.dto";
import { Match, MatchStatus } from "../entity/match.entity";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
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
    async getMyMatch(userId: number) {
        const matches = await this.matchRepository.find({
            where: {
                guestId: userId,
            },
        });
        return matches;
    }

    async findMyMatch(id: number, userid: number) {
        const findmatch = await this.matchRepository.findOne({
            where: {
                id: id,
            },
        });

        if (findmatch.guestId !== userid) {
            throw new NotFoundException(
                `matchid ${id}에 대한 권한이 없습니다.`,
            );
        }
        findmatch.updateProgress();
        return findmatch;
    }
    async postMatch(id: number, userid: number, matchDTO: MatchDTO) {
        const findRecruit = await this.recruitRepository.findOne({
            where: {
                id: id,
            },
        });
        if (!findRecruit) {
            throw new NotFoundException(
                `Recruit with id ${id} 을 찾을 수 없습니다.`,
            );
        }
        if (findRecruit.status === Status.Complete) {
            throw new NotFoundException("모집이 완료되었습니다.");
        }

        await this.checkMatch(id, userid);
        const user = await this.userRepository.findOne({
            where: {
                id: userid,
            },
        });
        const hostId = findRecruit.hostId;
        const submitMatch = this.matchRepository.create({
            gameDate: findRecruit.gamedate,
            endTime: findRecruit.endtime,
            guestId: userid,
            postId: id,
            hostId: hostId,
            guestName: user.name,

            ...matchDTO,
        });
        await this.matchRepository.save(submitMatch);
        return submitMatch;
    }

    async cancelMatch(id: number, userid: number) {
        const findmatch = await this.findMyMatch(id, userid);

        if (findmatch.guestId !== userid) {
            throw new NotFoundException(
                `matchid ${id}에 대한 권한이 없습니다.`,
            );
        }

        if (findmatch.status === MatchStatus.CONFIRM) {
            throw new NotFoundException("컴펀된 경기는 취소할 수 없습니다.");
        }
        const RecruitId = findmatch.postId;
        const Recruit = await this.recruitRepository.findOne({
            where: {
                id: RecruitId,
            },
        });
        if ((findmatch.status = MatchStatus.APPROVED)) {
            Recruit.totalmember += 1;
            if (Recruit.status === Status.Complete) {
                Recruit.status = Status.Recruiting;
            }
            await this.recruitRepository.save(Recruit);
        }
        findmatch.status = MatchStatus.CANCEL;

        return await this.matchRepository.save(findmatch);
    }
    //모집글에서 승인된 유저아이디 조회
    async findGameUser(userId: number, id: number) {
        const findmatch = await this.findMyMatch(id, userId);

        if (!findmatch) {
            throw new NotFoundException(`Match ${id}을 찾을 수 없습니다.`);
        }

        const matches = await this.matchRepository.find({
            where: {
                postId: findmatch.postId,
                status: MatchStatus.CONFIRM,
            },
        });

        if (!matches || matches.length === 0) {
            throw new NotFoundException("컴펌된 유저가 없습니다.");
        }

        const users = [];

        for (const match of matches) {
            const guestUser = await this.userRepository.findOne({
                where: {
                    id: match.guestId,
                },
                select: {
                    id: true,
                    name: true,
                },
            });

            if (guestUser) {
                users.push(guestUser);
            }
        }

        return users;
    }

    //매치 컴펌하기
    async confirmMatch(id: number, userId: number) {
        const findMatch = await this.findMyMatch(id, userId);
        if (findMatch.status === MatchStatus.APPLICATION_COMPLETE) {
            throw new NotFoundException("처리중입니다.");
        }

        if (findMatch.status === MatchStatus.REJECTED) {
            await this.matchRepository.remove(findMatch);
        } else if (findMatch.status === MatchStatus.APPROVED) {
            findMatch.status = MatchStatus.CONFIRM;

            await this.matchRepository.save(findMatch);
        }
        return findMatch;
    }

    // 경기 평가완료하기
    async doneGame(userId: number, id: number) {
        const findMatch = await this.findMyMatch(id, userId);

        if (findMatch.endTime >= new Date()) {
            throw new NotFoundException("경기가 끝난 후 평가 가능합니다.");
        }

        findMatch.evaluate = true;
        findMatch.progress = Progress.EVALUATION_COMPLETED;

        await this.matchRepository.save(findMatch);
    }

    // 취소/평가 후 삭제
    async deleteGame(userId: number, id: number) {
        const findMatch = await this.findMyMatch(id, userId);

        if (
            findMatch.status !== MatchStatus.CANCEL ||
            findMatch.progress !== Progress.EVALUATION_COMPLETED
        ) {
            throw new NotFoundException(
                "취소 || 평가 후에만 삭제할 수 있습니다.",
            );
        }

        await this.matchRepository.remove(findMatch);
    }
    private async checkMatch(id: number, userid: number) {
        const matche = await this.matchRepository.findOne({
            where: {
                postId: id,
            },
        });
        if (matche && matche.guestId == userid) {
            throw new NotFoundException("이미 신청하셨습니다.");
        }
    }
}
