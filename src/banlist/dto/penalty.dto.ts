import { Column } from "typeorm";
import { Banlist } from "../../entity/banlist.entity";
import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEnum, IsNotEmpty } from "class-validator";
import { ActionType } from "../../entity/banlist.entity";
export class PenaltyDTO {
    @IsNotEmpty()
    @IsDate()
    @ApiProperty({
        example: "10",
        description: "벤 기간",
    })
    duration: number;
}
