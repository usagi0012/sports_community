import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Req,
    UseGuards,
    Put,
    Query,
} from "@nestjs/common";
import { UserCalenderService } from "./user-calender.service";
import { CreateUserCalenderDto } from "./dto/create-user-calender.dto";
import { UpdateUserCalenderDto } from "./dto/update-user-calender.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { accessTokenGuard } from "src/auth/guard/access-token.guard";
import { UserId } from "src/auth/decorators/userId.decorator";
import { Alarmservice } from "src/alarm/alarm.service";

@ApiTags("캘린더")
@ApiBearerAuth("accessToken")
@UseGuards(accessTokenGuard)
@Controller("user/me/calender")
export class UserCalenderController {
    constructor(
        private readonly userCalenderService: UserCalenderService,
        private readonly alarmService: Alarmservice,
    ) {}

    //캘린더 일정 작성하기
    @Post()
    create(
        @UserId() userId: number,
        @Body() createUserCalenderDto: CreateUserCalenderDto,
    ) {
        return this.userCalenderService.create(userId, createUserCalenderDto);
    }

    //유저의 전체 일정 가져오기
    @Get()
    findAll(@UserId() userId: number) {
        return this.userCalenderService.findAll(userId);
    }

    // //유저의 특정 일정 가져오기
    // @Get("/:calenderId")
    // findCalenderById(
    //     @UserId() userId: number,
    //     @Param("calenderId") calenderId: string,
    // ) {
    //     console.log(calenderId);
    //     return this.userCalenderService.findCalenderById(userId, calenderId);
    // }

    //일정 수정하기
    @Put("/:calenderId")
    update(
        @UserId() userId: number,
        @Param("calenderId") calenderId: string,
        @Body() updateUserCalenderDto: UpdateUserCalenderDto,
    ) {
        console.log("들어온 캘린더ID", calenderId);
        // this.alarmService.sendAlarm(userId, "확인");
        return this.userCalenderService.update(
            +userId,
            calenderId,
            updateUserCalenderDto,
        );
    }

    //일정 삭제하기
    @Delete("/:calenderId")
    remove(@UserId() userId: number, @Param("calenderId") calenderId: string) {
        console.log(calenderId);
        return this.userCalenderService.remove(+userId, calenderId);
    }

    // 유저의 특정 날짜 데이터 가져오기
    @Get("/date")
    findCalenderByDate(@UserId() userId: number, @Query("date") date: string) {
        console.log(date);
        const parsedDate = new Date(date); // 문자열을 Date로 변환
        console.log(parsedDate);
        return this.userCalenderService.findCalenderByDate(userId, parsedDate);
    }
}
