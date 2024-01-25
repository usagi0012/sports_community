import { UserType } from "../../entity/user.entity";
import { ApiProperty } from "@nestjs/swagger";
import {
    IsBoolean,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
} from "class-validator";

export class CreateUserDto {
    @IsString()
    @ApiProperty({ description: "이메일", example: "example12@naver.com" })
    email: string;

    @IsString()
    @ApiProperty({ description: "비밀번호", example: "1234" })
    password: string;

    @IsString()
    @ApiProperty({ description: "이름", example: "테스트" })
    name: string;
}

export class CreateAdminDto {
    @IsString()
    @ApiProperty({ description: "이메일", example: "example12@naver.com" })
    email: string;

    @IsString()
    @ApiProperty({ description: "비밀번호", example: "1234" })
    password: string;

    @IsString()
    @ApiProperty({ description: "이름", example: "테스트" })
    name: string;

    @IsEnum(UserType)
    @IsOptional()
    @ApiProperty({ description: "관리자 여부", example: "admin" })
    UserType: UserType;
}
