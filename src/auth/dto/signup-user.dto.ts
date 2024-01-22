import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { CreateUserDto } from "../../user/dto/create-user.dto";

export class SignupUserDto extends CreateUserDto {
    @IsString()
    @ApiProperty({ description: "비밀번호 확인", example: "1234" })
    checkPassword: string;
}
