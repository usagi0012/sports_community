import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ApplicationDto {
    @IsString()
    @IsNotEmpty({ message: "동호회에 보낼 메세지를 입력해주세요." })
    @ApiProperty({ description: "메세지" })
    message: string;

    @IsNumber()
    @IsNotEmpty({ message: "동호회에 보낼 동호회 ID를 입력해주세요." })
    @ApiProperty({ description: "클럽 아이디" })
    clubId: number;
}
