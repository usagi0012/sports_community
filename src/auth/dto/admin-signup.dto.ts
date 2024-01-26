import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsString } from "class-validator";
import { CreateAdminDto } from "../../user/dto/create-user.dto";

export class SignupAdminDto extends CreateAdminDto {
    @IsString()
    @ApiProperty({ description: "비밀번호 확인", example: "1234" })
    checkPassword: string;
}
