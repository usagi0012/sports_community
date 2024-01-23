import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Gender } from "src/entity/user-profile.entity";

export class CreateUserProfileDto {
    @IsOptional()
    @IsString()
    @ApiProperty({ description: "닉네임", example: "닉네임테스트" })
    nickname?: string;

    @IsOptional() // nullable한 속성은 IsOptional 사용
    @IsString()
    @ApiProperty({ description: "설명", example: "설명테스트" })
    description?: string;

    @IsOptional()
    @IsNumber()
    @ApiProperty({ description: "키", example: "190" })
    height?: number;

    @IsEnum(Gender)
    @ApiProperty({ description: "성별", example: "male" })
    gender: Gender;
}
