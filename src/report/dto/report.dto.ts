import { Report } from "./../../entity/report.entity";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ReportDTO {
    @IsNotEmpty()
    @ApiProperty({
        example: "벤해주세요",
        description: "벤 코멘트",
    })
    @IsString()
    reportContent: string;

    @IsNotEmpty()
    @ApiProperty({
        example: 1,
        description: "벤 대상 사용자 ID",
    })
    @IsNumber()
    benUserId: number;
}