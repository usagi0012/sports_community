import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class PermissionApplicationDto {
    @IsString()
    @IsNotEmpty({ message: "동호회에 보낼 메세지를 입력해주세요." })
    @ApiProperty({ description: "메세지" })
    message: string;
}
