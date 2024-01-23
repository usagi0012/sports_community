import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Gender } from "src/entity/user-profile.entity";

export class UpdateUserProfileDto {
    @IsString()
    @IsOptional()
    @ApiProperty({ description: "닉네임", example: "수정된 닉네임" })
    nickname: string;

    @IsOptional() // nullable한 속성은 IsOptional 사용
    @IsString()
    @ApiProperty({ description: "설명", example: "수정된 설명" })
    description?: string;

    @IsOptional()
    @IsNumber()
    @ApiProperty({ description: "키", example: "185" })
    height: number;

    @IsOptional()
    @IsEnum(Gender)
    @ApiProperty({ description: "성별", example: "male" })
    gender?: Gender;
}
