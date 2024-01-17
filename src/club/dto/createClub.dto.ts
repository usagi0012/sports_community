import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString } from "class-validator";
import { Region } from "src/enumtypes/clubregion.type";

export class CreateClubDto {
    @ApiProperty({ description: "이름" })
    @IsString()
    name: string;

    @ApiProperty({ description: "지역" })
    @IsEnum(Region)
    region: Region;

    @ApiProperty({ description: "설명" })
    @IsString()
    description: string;
}
