import {
    IsNotEmpty,
    IsEnum,
    IsBoolean,
    IsNumber,
    IsDate,
    IsString,
    IsEmpty,
    IsOptional,
} from "class-validator";
import { Rule, Status } from "../../entity/recruit.entity";
import { ApiProperty } from "@nestjs/swagger";
import { Region } from "src/enumtypes/clubregion.type";
export class RecruitDTO {
    @IsNotEmpty()
    @ApiProperty({ description: "title", example: "테스트" })
    @IsString()
    title: string;

    @IsNotEmpty()
    @ApiProperty({ description: "region", example: "Seoul" })
    @IsEnum(Region)
    region: Region;

    @IsNotEmpty()
    @ApiProperty({ description: "gps", example: "지도" })
    @IsString()
    gps: string;

    @IsNotEmpty()
    @ApiProperty({ description: "content", example: "한판하자" })
    @IsString()
    content: string;

    @IsNotEmpty()
    @ApiProperty({ description: "경기 시간", example: "2024-01-24T00:00:00Z" })
    @IsDate()
    gamedate: Date;

    @IsNotEmpty()
    @ApiProperty({ description: "끝나는시간", example: "2024-01-24T00:30:00Z" })
    @IsNumber()
    endtime: number;

    @IsNotEmpty()
    @ApiProperty({ description: "룰", example: "3대3" })
    @IsEnum(Rule)
    rule: Rule;

    @IsNotEmpty()
    @ApiProperty({ description: "총 멤버", example: "1" })
    @IsNumber()
    totalmember: number;
}

export class UpdateDto {
    @IsNotEmpty()
    @ApiProperty({ description: "승인/거절", example: "승인" })
    @IsEnum(Status)
    status: Status;
}
export class PutDTO {
    @IsOptional()
    @ApiProperty({ description: "타이틀", example: "타이틀 변경" })
    @IsString()
    title: string;

    @IsOptional()
    @ApiProperty({ description: "지역", example: "Seoul" })
    @IsEnum(Region)
    region: Region;

    @IsOptional()
    @ApiProperty({ description: "쥐피에스", example: "gps" })
    @IsString()
    gps: string;

    @IsOptional()
    @ApiProperty({ description: "내용", example: "하지말자" })
    @IsString()
    content: string;

    @IsOptional()
    @ApiProperty({ description: "경기시간", example: "2024-01-24T00:00:00Z" })
    @IsDate()
    gamedate: Date;

    @IsOptional()
    @ApiProperty({ description: "종료", example: 2 })
    @IsNumber()
    endtime: number;

    @IsOptional()
    @ApiProperty({ description: "역할", example: "3대3" })
    @IsEnum(Rule)
    rule: Rule;

    @IsOptional()
    @ApiProperty({ description: "총멤버수 ", example: "1" })
    @IsNumber()
    totalmember: number;
}
