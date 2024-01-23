import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsString } from "class-validator";

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

    @IsString()
    @ApiProperty({ description: "인증상태" })
    verificationStatus: string;
}
