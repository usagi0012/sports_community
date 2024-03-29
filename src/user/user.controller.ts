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
    Query,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { accessTokenGuard } from "../auth/guard/access-token.guard";
import { UserId } from "../auth/decorators/userId.decorator";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ChangeUserDto } from "./dto/change-user.dto";
import { CheckPasswordDto } from "./dto/checkPassword.dto";
import { Alarmservice } from "src/alarm/alarm.service";

@ApiTags("개인 정보")
@Controller("user")
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly alarmService: Alarmservice,
    ) {}

    //이메일 중복 확인
    @Get("email")
    findEmail(@Query("email") email: string) {
        return this.userService.existEmail(email);
    }

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
        // this.alarmService.sendAlarm(+id, "알람테스트 22");
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

    //수정시 현재 비밀번호 확인
    @ApiBearerAuth("accessToken")
    @UseGuards(accessTokenGuard)
    @Post("me/checkPassword")
    checkPassword(
        @UserId() id: string,
        @Body() checkPasswordDto: CheckPasswordDto,
    ) {
        return this.userService.checkPassword(+id, checkPasswordDto);
    }

    //다른사람 정보 조회
    @ApiBearerAuth("accessToken")
    @UseGuards(accessTokenGuard)
    @Get("/:userId")
    findUserByIdAll(@Param("userId") id: number) {
        return this.userService.findUserByIdAll(+id);
    }

    //다른사람 정보조회(프로필 전용)
    @ApiBearerAuth("accessToken")
    @UseGuards(accessTokenGuard)
    @Get("profile/:otherUserId")
    findUser(
        @UserId() userId: number,
        @Param("otherUserId") otherUserId: number,
    ) {
        return this.userService.findUser(+otherUserId, userId);
    }
}
