import { ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { LargeNumberLike } from "crypto";

export class ChangeUserDto {
    @IsOptional()
    @IsString()
    @ApiPropertyOptional({ description: "이메일" })
    email?: string;

    @IsString()
    @ApiPropertyOptional({ description: "비밀번호" })
    password?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({ description: "변경할 비밀번호" })
    changePassword?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({ description: "변경할 비밀번호 확인" })
    changePasswordConfirm?: string;
}
