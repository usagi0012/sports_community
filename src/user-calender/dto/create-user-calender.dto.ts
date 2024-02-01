import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsOptional, IsString } from "class-validator";
import { isString } from "lodash";

export class CreateUserCalenderDto {
    @IsString()
    @ApiProperty({ description: "날짜", example: "2024-01-25T00:00:00.000Z" })
    date?: string;

    @IsString()
    @ApiProperty({ description: "제목", example: "테스트 제목" })
    title?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ description: "내용", example: "테스트 내용" })
    description: string;

    @IsString()
    @ApiProperty({ description: "색상", example: "#ff0000" })
    color: string;
}
