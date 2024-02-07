import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ChatInvitationDto {
    @IsString()
    @IsNotEmpty({ message: "초대할 멤버의 닉네임을 입력하세요." })
    @ApiProperty({ description: "초대할 멤버닉네임" })
    nickName: string;
}
