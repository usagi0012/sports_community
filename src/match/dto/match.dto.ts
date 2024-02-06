import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class MatchDTO {
    @IsNotEmpty()
    @ApiProperty({
        example: "껴주세요",
        description: "신청메세지",
    })
    @IsString()
    message: string;
}
