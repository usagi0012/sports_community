import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsOptional, IsString } from "class-validator";
import { isString } from "lodash";

export class UpdateUserCalenderDto {
    @IsOptional()
    @IsString()
    @ApiProperty({ description: "날짜" })
    date?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ description: "제목" })
    title?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ description: "내용" })
    description: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ description: "색상" })
    color: string;
}
