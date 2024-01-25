import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEnum, IsNotEmpty } from "class-validator";

export class PenaltyDTO {
    @IsNotEmpty()
    @ApiProperty({
        example: 10,
        description: "벤 기간",
    })
    duration: number;
}
