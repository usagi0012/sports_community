import { IsNotEmpty, IsEnum } from "class-validator";
import { MatchStatus } from "../../entity/match.entity";
import { ApiProperty } from "@nestjs/swagger";

export class MatchUpdateDto {
    @IsNotEmpty()
    @ApiProperty({ description: "승인/거절", example: "승인" })
    @IsEnum(MatchStatus)
    status: MatchStatus;
}
