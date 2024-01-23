import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean } from "class-validator";

export class CreateUserPositionDto {
    @ApiProperty({ description: "가드", example: false })
    @IsBoolean()
    guard?: boolean = false;

    @IsBoolean()
    @ApiProperty({ description: "포워드", example: true })
    forward?: boolean = false;

    @IsBoolean()
    @ApiProperty({ description: "센터", example: true })
    center?: boolean = false;
}
