import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean } from "class-validator";

export class CreateUserPositionDto {
    @ApiProperty({ description: "가드" })
    @IsBoolean()
    guard?: boolean = false;

    @IsBoolean()
    @ApiProperty({ description: "포워드" })
    forward?: boolean = false;

    @IsBoolean()
    @ApiProperty({ description: "센터" })
    center?: boolean = false;
}
