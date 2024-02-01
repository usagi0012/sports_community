import { ApiProperty, PickType } from "@nestjs/swagger";
import { CreateUserDto } from "../../user/dto/create-user.dto";

export class LoginUserDto extends PickType(CreateUserDto, [
    "email",
    "password",
]) {
    @ApiProperty({
        example: "example12@naver.com",
        description: "이메일",
    })
    email: string;

    @ApiProperty({
        example: "1234",
        description: "비밀번호",
    })
    password: string;
}
