import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ChatExpelMemeberDto {
    @IsString()
    @IsNotEmpty({ message: "추방할 멤버의 닉네임을 입력하세요." })
    @ApiProperty({ description: "추방할 멤버닉네임" })
    nickName: string;
}
