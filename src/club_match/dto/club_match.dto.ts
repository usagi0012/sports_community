import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { ClubMatchStatus } from "src/entity/club_match.entity";

export class ClubMatchDTO {
    @IsNotEmpty()
    @IsString()
    message: string;

    @IsNotEmpty()
    @IsString()
    Information: string;
}

export class CheckClubMatchDTO {
    @IsNotEmpty()
    @IsEnum(ClubMatchStatus)
    status: ClubMatchStatus;
}
