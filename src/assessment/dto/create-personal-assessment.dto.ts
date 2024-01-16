import { PickType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { Userscore } from "src/entity/personal.assessment.entity";
import { CreatePersonalTagDto } from "./create-personal-tag.dto";

export class CreateAssessmentDto extends PickType(Userscore, [
    "personality",
    "ability",
    "mvp",
]) {
    // @ValidateNested()
    // @Type(() => CreatePersonalTagDto)
    // tag: CreatePersonalTagDto;
}
