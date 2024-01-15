import { MatchDTO } from "./dto/match.dto";
import { Match } from "src/entity/match.entity";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Recruit } from "src/entity/recruit.entity";

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
                hostid: userId,
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

        if (findmatch.hostid !== userid) {
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

        const submitMatch = this.matchRepository.create({
            hostid: userid,
            recuritedid: id,
            ...matchDTO,
        });

        await this.matchRepository.save(submitMatch);
        return submitMatch;
    }

    async deleteMatch(id: number, userid: number) {
        const findmatch = await this.findMyMatch(id, userid);

        await this.matchRepository.remove(findmatch);
    }
}
