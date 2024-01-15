import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from "@nestjs/common";
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

    // async postcolumn(
    //     boardid: number,
    //     userId: number,
    //     postColumnDto: PostColumnDto,
    //   ) {
    //     const maxOrderColumn = await this.boardcolumnRepository.findOne({
    //       where: { board_id: boardid },
    //       order: { order: 'DESC' },
    //     });

    //     const order = maxOrderColumn ? maxOrderColumn.order + 1 : 1;

    //     const boardColumn = this.boardcolumnRepository.create({
    //       name: postColumnDto.name,
    //       order: order,
    //       board_id: boardid,
    //       user_id: userId,
    //     });

    //     await this.boardcolumnRepository.save(boardColumn);
    //     return boardColumn;
    //   }

    async postRecruit(recruitDTO: RecruitDTO) {
        const newRecruit = this.recruitRepository.create(recruitDTO);

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
    async putRecruit(recruitDTO: RecruitDTO, id: number) {
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

    async updateRecruit(updateDto: UpdateDto, id: number) {
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

        existingRecruit.status = updateDto.status;

        const updatedRecruit =
            await this.recruitRepository.save(existingRecruit);

        return updatedRecruit;
    }

    async deleteRecruit(id: number) {
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

        await this.recruitRepository.remove(existingRecruit);
    }
}
