import { UserId } from "../auth/decorators/userId.decorator";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Recruit, Status } from "../entity/recruit.entity";
import { RecruitDTO, UpdateDto, PutDTO } from "./dto/recruit.dto";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Match, MatchStatus } from "../entity/match.entity";
import { MatchUpdateDto } from "./dto/checkmatch.dto";

@Injectable()
export class RecruitService {
    constructor(
        @InjectRepository(Recruit)
        private recruitRepository: Repository<Recruit>,
        @InjectRepository(Match)
        private matchRepository: Repository<Match>,
    ) {}

    async postRecruit(hostid: number, recruitDTO: RecruitDTO) {
        const newRecruit = this.recruitRepository.create({
            hostid: hostid,
            ...recruitDTO,
        });

        await this.recruitRepository.save(newRecruit);
    }

    async getRecruit() {
        const Recruit = await this.recruitRepository.find();

        return Recruit;
    }

    async findRecruit(id: number) {
        const findRecruit = await this.recruitRepository.findOne({
            where: {
                id: id,
            },
        });

        return findRecruit;
    }
    async putRecruit(hostid: number, putDTO: PutDTO, id: number) {
        const existingRecruit = await this.recruitRepository.findOne({
            where: {
                id: id,
            },
        });

        if (!existingRecruit) {
            throw new NotFoundException(
                `Recruit with id ${id} 을 찾을 수 없습니다.`,
            );
        }

        await this.checkhost(hostid, id);

        existingRecruit.title = putDTO.title;
        existingRecruit.region = putDTO.region;
        existingRecruit.gps = putDTO.gps;
        existingRecruit.content = putDTO.content;
        existingRecruit.gamedate = putDTO.gamedate;
        existingRecruit.runtime = putDTO.runtime;
        existingRecruit.rule = putDTO.rule;
        existingRecruit.group = putDTO.group;
        existingRecruit.totalmember = putDTO.totalmember;

        const updatedRecruit =
            await this.recruitRepository.save(existingRecruit);

        return updatedRecruit;
    }

    async updateRecruit(hostid: number, updateDto: UpdateDto, id: number) {
        const existingRecruit = await this.recruitRepository.findOne({
            where: {
                id: id,
            },
        });

        if (!existingRecruit) {
            throw new NotFoundException(
                `Recruit with id ${id} 을 찾을 수 없습니다.`,
            );
        }

        await this.checkhost(hostid, id);

        existingRecruit.status = updateDto.status;

        const updatedRecruit =
            await this.recruitRepository.save(existingRecruit);

        return updatedRecruit;
    }

    async deleteRecruit(hostid: number, id: number) {
        const existingRecruit = await this.recruitRepository.findOne({
            where: {
                id: id,
            },
        });

        if (!existingRecruit) {
            throw new NotFoundException(
                `Recruit with id ${id}을 찾을 수 없습니다.`,
            );
        }

        await this.checkhost(hostid, id);

        await this.recruitRepository.remove(existingRecruit);
    }

    async myRecruit(userId: number) {
        const myRecruit = await this.recruitRepository.find({
            where: {
                hostid: userId,
            },
        });

        if (!myRecruit) {
            return new NotFoundException("모집글을 적어주세요!");
        }

        return myRecruit;
    }

    async findMyRecruit(userId: number, id: number) {
        await this.checkhost(userId, id);

        const myRecruit = await this.recruitRepository.findOne({
            where: {
                hostid: userId,
                id: id,
            },
            relations: ["matches"],
        });

        if (!myRecruit) {
            throw new NotFoundException("모집글을 찾을 수 없습니다!");
        }

        const matches = await this.findMatch(id);

        const recruitMatch = {
            myRecruit: myRecruit,
            matches: matches,
        };

        return recruitMatch;
    }

    async checkMatch(userId: number, id: number) {
        const match = await this.matchRepository.findOne({
            where: {
                id: id,
            },
        });

        if (match.hostid !== userId) {
            throw new NotFoundException("권한이 없습니다.");
        }

        return match;
    }

    async putMatch(userId: number, matchUpdateDto: MatchUpdateDto, id: number) {
        const match = await this.checkMatch(userId, id);
        const recruitId = match.recuritedid;

        const Recruit = await this.recruitRepository.findOne({
            where: {
                id: recruitId,
            },
        });

        if (matchUpdateDto.status === MatchStatus.APPROVED) {
            match.status = MatchStatus.APPROVED;
            Recruit.totalmember -= 1;

            if (Recruit.totalmember === 0) {
                Recruit.status = Status.Complete;

                const anotherMatchs = await this.matchRepository.find({
                    where: {
                        recuritedid: recruitId,
                        status: MatchStatus.APPLICATION_COMPLETE,
                    },
                });

                for (const individualMatch of anotherMatchs) {
                    individualMatch.status = MatchStatus.REJECTED;
                }

                await this.matchRepository.save(anotherMatchs);
            }
        } else if (matchUpdateDto.status === MatchStatus.REJECTED) {
            if (match.status === MatchStatus.APPROVED) {
                Recruit.totalmember += 1;
                await this.recruitRepository.save(Recruit);
            }
            match.status = MatchStatus.REJECTED;
        }

        await this.recruitRepository.save(Recruit);
        const updatedMatch = await this.matchRepository.save(match);

        return updatedMatch;
    }

    private findMatch(id: number) {
        const matchs = this.matchRepository.find({
            where: {
                recuritedid: id,
            },
        });

        return matchs;
    }

    private async checkhost(hostid: number, id: number) {
        const checkrecruit = await this.recruitRepository.findOne({
            where: {
                id: id,
            },
        });

        if (hostid !== checkrecruit.hostid) {
            throw new NotFoundException("호스트가 아닙니다.");
        }
    }
}
