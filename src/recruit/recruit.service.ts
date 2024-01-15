import { Injectable, NotFoundException } from "@nestjs/common";
import { Recruit } from "./entities/recruit.entity";
import { RecruitDTO, UpdateDto } from "./dto/recruit.dto";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class RecruitService {
    constructor(
        @InjectRepository(Recruit)
        private recruitRepository: Repository<Recruit>,
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
    async putRecruit(hostid: number, recruitDTO: RecruitDTO, id: number) {
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

        existingRecruit.title = recruitDTO.title;
        existingRecruit.region = recruitDTO.region;
        existingRecruit.gps = recruitDTO.gps;
        existingRecruit.content = recruitDTO.content;
        existingRecruit.gamedate = recruitDTO.gamedate;
        existingRecruit.runtime = recruitDTO.runtime;
        existingRecruit.rule = recruitDTO.rule;
        existingRecruit.group = recruitDTO.group;
        existingRecruit.totalmember = recruitDTO.totalmember;

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
