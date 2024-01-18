import { PickType } from "@nestjs/swagger";
import { Clubtagcounter } from "src/entity/clubtagcounter.entity";

export class ClubTagCounterDto extends PickType(Clubtagcounter, [
    "bed",
    "buksan",
    "fighter",
    "gentle",
    "goldenstate",
    "lakers",
    "late",
    "manner",
    "notbed",
    "oneman",
    "sanantonio",
    "tough",
    "zaza",
]) {}
