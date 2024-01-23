import { User } from "./../entity/user.entity";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Progress, Recruit, Status } from "../entity/recruit.entity";
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
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async postRecruit(userId: number, recruitDTO: RecruitDTO) {
        const basicnumber = recruitDTO.totalmember;
        const newRecruit = this.recruitRepository.create({
            basictotalmember: basicnumber,
            hostId: userId,
            ...recruitDTO,
        });

        return await this.recruitRepository.save(newRecruit);
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

        await this.checkHost(hostid, id);

        existingRecruit.title = putDTO.title;
        existingRecruit.region = putDTO.region;
        existingRecruit.gps = putDTO.gps;
        existingRecruit.content = putDTO.content;
        existingRecruit.gamedate = putDTO.gamedate;
        existingRecruit.endtime = putDTO.endtime;
        existingRecruit.rule = putDTO.rule;
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

        await this.checkHost(hostid, id);

        existingRecruit.status = updateDto.status;

        const updatedRecruit =
            await this.recruitRepository.save(existingRecruit);

        return updatedRecruit;
    }
    //모집 글 삭제
    async deleteRecruit(hostid: number, id: number) {
        const existingRecruit = await this.recruitRepository.findOne({
            where: {
                id: id,
            },
        });

        if (!existingRecruit) {
            throw new NotFoundException(
                `ID가 ${id}인 리크루트를 찾을 수 없습니다.`,
            );
        }

        await this.checkHost(hostid, id);

        if (existingRecruit.basictotalmember !== existingRecruit.totalmember) {
            throw new NotFoundException(
                "이미 컴펌된 경기이거나 평가 후 삭제할 수 있습니다. ",
            );
        }

        await this.recruitRepository.remove(existingRecruit);
    }

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

    async findMyRecruit(userId: number, id: number) {
        await this.checkHost(userId, id);
        const matches = await this.findMatch(id);

        const myRecruit = await this.recruitRepository.findOne({
            where: {
                hostId: userId,
                id: id,
            },
        });

        if (!myRecruit) {
            throw new NotFoundException("모집글을 찾을 수 없습니다!");
        }

        await this.updateProgress(myRecruit);

        await this.recruitRepository.save(myRecruit);

        const result = {
            myRecruit: myRecruit,
            matches: matches,
        };

        return result;
    }

    async checkMatch(userId: number, id: number) {
        const match = await this.matchRepository.findOne({
            where: {
                id: id,
            },
        });

        console.log(match.hostId);
        console.log(userId);
        if (match.hostId !== userId) {
            throw new NotFoundException("권한이 없습니다.");
        }

        return match;
    }

    async putMatch(userId: number, matchUpdateDto: MatchUpdateDto, id: number) {
        const match = await this.checkMatch(userId, id);
        const recruitId = match.postId;

        const recruit = await this.recruitRepository.findOne({
            where: {
                id: recruitId,
            },
        });

        if (!recruit) {
            throw new NotFoundException(
                `Recruit with ID ${recruitId} not found`,
            );
        }

        if (matchUpdateDto.status === MatchStatus.APPROVED) {
            match.status = MatchStatus.APPROVED;
            recruit.totalmember -= 1;

            if (recruit.totalmember === 0) {
                recruit.status = Status.Complete;
                await this.recruitRepository.save(recruit);

                const anotherMatches = await this.matchRepository.find({
                    where: {
                        postId: match.postId,
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
    async getGameUser(userId: number, id: number) {
        const hostid = userId;
        await this.checkHost(hostid, id);

        const matches = await this.matchRepository.find({
            where: {
                postId: id,
                status: MatchStatus.CONFIRM,
            },
        });

        console.log(matches);
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

    //평가완료하기
    async evaluateGame(userId: number, id: number) {
        const hostid = userId;
        const recruit = await this.checkHost(hostid, id);

        if (recruit.progress !== Progress.PLEASE_EVALUATE) {
            throw new NotFoundException("경기가 끝난후에 평가 가능합니다.");
        }

        recruit.progress = Progress.EVALUATION_COMPLETED;

        return await this.recruitRepository.save(recruit);
    }

    private async findMatch(id: number) {
        const matches = await this.matchRepository.find({
            where: { postId: id },
            select: ["id", "message", "guestName"],
        });

        return matches;
    }
    private async checkHost(hostid: number, id: number) {
        console.log(hostid);
        console.log(id);

        const checkrecruit = await this.recruitRepository.findOne({
            where: {
                id: id,
            },
        });

        console.log(checkrecruit);

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
