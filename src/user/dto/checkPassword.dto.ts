import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CheckPasswordDto {
    @IsString()
    @ApiProperty({ description: "비밀번호" })
    password: string;
}
