import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ChatExpelMemeberDto {
    @IsNumber()
    @IsNotEmpty({ message: "추방할 멤버의 아이디를 입력하세요." })
    @ApiProperty({ description: "추방할 멤버아이디" })
    memberId: number;

    @IsNumber()
    @IsNotEmpty({ message: "추방할 채팅방 아이디를 입력하세요." })
    @ApiProperty({ description: "추방할 채팅방 아이디" })
    chatId: number;
}
