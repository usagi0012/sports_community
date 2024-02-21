import { ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsOptional()
    @IsString()
    @ApiPropertyOptional({ description: "refresh 토큰" })
    currentRefreshToken?: string;

    @IsOptional()
    @IsNumber()
    @ApiPropertyOptional({ description: "인증 상태" })
    isVerified?: boolean;
}
