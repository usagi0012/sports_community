import { PickType } from "@nestjs/swagger";
import { Personaltag } from "src/entity/personal.assessment.tag.entity";

export class CreatePersonalTagDto extends PickType(Personaltag, [
    "chisu",
    "curry",
    "daeman",
    "irving",
    "jorden",
    "late",
    "mean",
    "run",
    "teawoong",
    "thief",
    "yakbird",
    "zaza",
]) {}
