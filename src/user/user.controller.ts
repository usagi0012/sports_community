import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Put,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { accessTokenGuard } from "../auth/guard/access-token.guard";
import { UserId } from "../auth/decorators/userId.decorator";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ChangeUserDto } from "./dto/change-user.dto";

@ApiTags("개인 정보")
@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    //관리자로 변경하기
    @ApiBearerAuth("accessToken")
    @UseGuards(accessTokenGuard)
    @Put("admin")
    putAdmin(@UserId() userId: number) {
        return this.userService.putAdmin(userId);
    }

    //전체 유저정보 조회
    @ApiBearerAuth("accessToken")
    @UseGuards(accessTokenGuard)
    @Get("")
    findAll() {
        return this.userService.findAll();
    }

    //내 정보 조회
    @ApiBearerAuth("accessToken")
    @UseGuards(accessTokenGuard)
    @Get("me")
    findUserById(@UserId() id: string) {
        return this.userService.findUserById(+id);
    }

    //내 정보 수정
    @ApiBearerAuth("accessToken")
    @UseGuards(accessTokenGuard)
    @Put("me")
    updateUserById(@UserId() id: string, @Body() changeUserDto: ChangeUserDto) {
        return this.userService.updateUser(+id, changeUserDto);
    }

    //내 정보 삭제
    @ApiBearerAuth("accessToken")
    @UseGuards(accessTokenGuard)
    @Delete("me")
    deleteUserById(@UserId() id: string) {
        return this.userService.deleteUserById(+id);
    }
}
