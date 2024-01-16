import { MatchDTO } from "./dto/match.dto";
import { Match, MatchStatus } from "src/entity/match.entity";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Recruit, Status } from "src/entity/recruit.entity";

@Injectable()
export class MatchService {
    constructor(
        @InjectRepository(Match)
        private matchRepository: Repository<Match>,
        @InjectRepository(Recruit)
        private recruitRepository: Repository<Recruit>,
    ) {}

    async getMyMatch(userId: number) {
        const matches = await this.matchRepository.find({
            where: {
                guestid: userId,
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

        if (findmatch.guestid !== userid) {
            throw new NotFoundException(
                `matchid ${id}에 대한 권한이 없습니다.`,
            );
        }

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

        const hostId = findRecruit.hostid;
        const submitMatch = this.matchRepository.create({
            guestid: userid,
            recuritedid: id,
            hostid: hostId,
            ...matchDTO,
        });

        await this.matchRepository.save(submitMatch);
        return submitMatch;
    }

    async deleteMatch(id: number, userid: number) {
        const findmatch = await this.findMyMatch(id, userid);

        if (findmatch.guestid !== userid) {
            throw new NotFoundException(
                `matchid ${id}에 대한 권한이 없습니다.`,
            );
        }

        const RecruitId = findmatch.recuritedid;
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
        await this.matchRepository.remove(findmatch);
    }

    private async checkMatch(id: number, userid: number) {
        const matche = await this.matchRepository.findOne({
            where: {
                recuritedid: id,
            },
        });
        if (matche && matche.guestid == userid) {
            throw new NotFoundException("이미 신청하셨습니다.");
        }
    }
}
