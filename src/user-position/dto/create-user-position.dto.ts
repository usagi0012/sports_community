import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean } from "class-validator";

export class CreateUserPositionDto {
    @ApiProperty({ description: "가드" })
    @IsBoolean()
    guard: boolean;

    @IsBoolean()
    @ApiProperty({ description: "포워드" })
    forward: boolean;

    @IsBoolean()
    @ApiProperty({ description: "센터" })
    center: boolean;
}
