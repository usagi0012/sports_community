import { Module } from "@nestjs/common";
import { AssessmentService } from "./assessment.service";
import { AssessmentController } from "./assessment.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Userscore } from "src/entity/personal.assessment.entity";
import { Personaltag } from "src/entity/personal.assessment.tag.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Userscore, Personaltag])],
    controllers: [AssessmentController],
    providers: [AssessmentService],
})
export class AssessmentModule {}
