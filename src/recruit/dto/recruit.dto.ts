import {
    IsNotEmpty,
    IsEnum,
    IsBoolean,
    IsNumber,
    IsDate,
    IsString,
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
