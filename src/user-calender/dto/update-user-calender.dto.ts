import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsOptional, IsString } from "class-validator";
import { isString } from "lodash";

export class UpdateUserCalenderDto {
    @IsOptional()
    @IsString()
    @ApiProperty({ description: "날짜", example: "2024-01-27T00:00:00.000Z" })
    date?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ description: "제목", example: "수정된 제목" })
    title?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ description: "내용", example: "수정된 내용" })
    description: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ description: "색상", example: "blue" })
    color: string;
}
