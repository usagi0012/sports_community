import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsOptional, IsString } from "class-validator";
import { isString } from "lodash";

export class CreateUserCalenderDto {
    @IsString()
    @ApiProperty({ description: "날짜" })
    date?: string;

    @IsString()
    @ApiProperty({ description: "제목" })
    title?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ description: "내용" })
    description: string;

    @IsString()
    @ApiProperty({ description: "색상" })
    color: string;
}
