import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ApplicationReviewDto {
    @IsBoolean()
    @IsNotEmpty({ message: "승인여부를 입력해주세요." })
    @ApiProperty({ description: "승인여부", example: true })
    permission: boolean;

    @IsString()
    @IsNotEmpty({ message: "닉네임이 필요합니다." })
    @ApiProperty({ description: "닉네임", example: "철수" })
    nickName: string;
}
