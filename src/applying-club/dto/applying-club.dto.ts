import { IsNotEmpty, IsString } from "class-validator";

export class ApplyingClubDto {
    @IsString()
    @IsNotEmpty({ message: "동호회에 보낼 메세지를 입력해주세요." })
    message: string;
}
