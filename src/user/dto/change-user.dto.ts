import { ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { LargeNumberLike } from "crypto";

export class ChangeUserDto {
    @IsOptional()
    @IsString()
    @ApiPropertyOptional({
        description: "이메일",
        example: "example12@naver.com",
    })
    email?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({ description: "변경할 비밀번호", example: "12345" })
    changePassword?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({
        description: "변경할 비밀번호 확인",
        example: "12345",
    })
    changePasswordConfirm?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({ description: "이메일 인증코드", example: "123456" })
    checkEmailCode?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({
        description: "수정 이메일 인증 확인",
    })
    isVerifiedEmail?: boolean;
}
