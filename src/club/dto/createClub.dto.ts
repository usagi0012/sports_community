import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString } from "class-validator";
import multer from "multer";
import { Region } from "src/enumtypes/clubregion.type";

export class CreateClubDto {
    @ApiProperty({ description: "이름", example: "testClub" })
    @IsString()
    name: string;

    @ApiProperty({ description: "지역", example: 1 })
    @IsEnum(Region)
    region: Region;

    @ApiProperty({ description: "설명", example: "testClubDescription" })
    @IsString()
    description: string;
}
