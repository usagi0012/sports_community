import { IsNotEmpty, IsEnum } from "class-validator";
import { MatchStatus } from "../../entity/match.entity";

export class MatchUpdateDto {
    @IsNotEmpty()
    @IsEnum(MatchStatus)
    status: MatchStatus;
}
