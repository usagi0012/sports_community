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
import { Region, Rule, Status } from "../../entity/recruit.entity";

export class RecruitDTO {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsEnum(Region)
    region: Region;

    @IsNotEmpty()
    @IsString()
    gps: string;

    @IsNotEmpty()
    @IsString()
    content: string;

    @IsNotEmpty()
    @IsDate()
    gamedate: Date;

    @IsNotEmpty()
    @IsNumber()
    runtime: number;

    @IsNotEmpty()
    @IsEnum(Rule)
    rule: Rule;

    @IsNotEmpty()
    @IsBoolean()
    group: boolean;

    @IsNotEmpty()
    @IsNumber()
    totalmember: number;
}

export class UpdateDto {
    @IsNotEmpty()
    @IsEnum(Status)
    status: Status;
}
export class PutDTO {
    @IsOptional()
    @IsString()
    title: string;

    @IsOptional()
    @IsEnum(Region)
    region: Region;

    @IsOptional()
    @IsString()
    gps: string;

    @IsOptional()
    @IsString()
    content: string;

    @IsOptional()
    @IsDate()
    gamedate: Date;

    @IsOptional()
    @IsNumber()
    runtime: number;

    @IsOptional()
    @IsEnum(Rule)
    rule: Rule;

    @IsOptional()
    @IsBoolean()
    group: boolean;

    @IsOptional()
    @IsNumber()
    totalmember: number;
}
