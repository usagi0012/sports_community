import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ExpelMemberDto {
    @ApiProperty({ description: "닉네임", example: "nickName" })
    @IsString()
    nickName: string;
}
