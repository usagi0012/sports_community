import { PickType } from "@nestjs/swagger";
import { Clubscore } from "src/entity/clubscore.entity";

export class CreateClubassessmenttagDto extends PickType(Clubscore, [
    "personalityAmount",
    "abilityAmount",
]) {}
