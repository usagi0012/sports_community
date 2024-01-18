import { PickType } from "@nestjs/swagger";
import { Userscore } from "src/entity/userscore.entity";

export class CreatePersonalAssessmentDto extends PickType(Userscore, [
    "abilityAmount",
    "personalityAmount",
]) {}
