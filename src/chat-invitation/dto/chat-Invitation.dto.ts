import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ChatInvitationDto {
    @IsNumber()
    @IsNotEmpty({ message: "초대할 멤버의 아이디를 입력하세요." })
    @ApiProperty({ description: "초대할 멤버아이디" })
    memberId: number;

    @IsNumber()
    @IsNotEmpty({ message: "초대할 채팅방 아이디를 입력하세요." })
    @ApiProperty({ description: "초대할 채팅방 아이디" })
    chatId: number;
}
