import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ApplicationReviewDto {
    @IsString()
    @IsNotEmpty({ message: "승인여부를 입력해주세요." })
    @ApiProperty({ description: "승인여부" })
    permission: boolean;
}
