import { PickType } from "@nestjs/swagger";
import { Clubtagcounter } from "src/entity/clubtagcounter.entity";

export class ClubTagCounterDto extends PickType(Clubtagcounter, [
    "buksan",
    "sanantonio",
    "gentle",
    "manner",
    "lakers",
    "oneman",
    "goldenstate",
    "notbed",
    "bed",
    "tough",
    "fighter",
    "late",
]) {}
