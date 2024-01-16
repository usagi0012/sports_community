import { Injectable } from "@nestjs/common";
import { CreateAssessmentDto } from "./dto/create-personal-assessment.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Userscore } from "src/entity/personal.assessment.entity";
import { Repository } from "typeorm";
import { Personaltag } from "src/entity/personal.assessment.tag.entity";

@Injectable()
export class AssessmentService {
    constructor(
        @InjectRepository(Userscore)
        private readonly userscoreRepository: Repository<Userscore>,
    ) {}
    async create(createAssessmentDto: CreateAssessmentDto) {
        const { ...restOfUserscore } = createAssessmentDto;

        const userscore = await this.userscoreRepository.save({
            ...restOfUserscore,
        });
        return userscore;
    }

    findAll() {
        return `This action returns all assessment`;
    }

    findOne(id: number) {
        return `This action returns a #${id} assessment`;
    }
}
