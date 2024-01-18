import { PickType } from "@nestjs/swagger";
import { Personaltagcounter } from "src/entity/personaltagcounter.entity";

export class PersonalTagCounterDto extends PickType(Personaltagcounter, [
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
