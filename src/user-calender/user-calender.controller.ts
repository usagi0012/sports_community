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
} from "@nestjs/common";
import { UserCalenderService } from "./user-calender.service";
import { CreateUserCalenderDto } from "./dto/create-user-calender.dto";
import { UpdateUserCalenderDto } from "./dto/update-user-calender.dto";
import { ApiBearerAuth } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";

@ApiBearerAuth()
@UseGuards(AuthGuard("accessToken"))
@Controller("user/me/calender")
export class UserCalenderController {
    constructor(private readonly userCalenderService: UserCalenderService) {}

    //캘린더 일정 작성하기
    @Post()
    create(
        @Req() req: any,
        @Body() createUserCalenderDto: CreateUserCalenderDto,
    ) {
        const userId = req.user.userId;
        return this.userCalenderService.create(userId, createUserCalenderDto);
    }

    //유저의 전체 일정 가져오기
    @Get()
    findAll(@Req() req: any) {
        const userId = req.user.userId;
        return this.userCalenderService.findAll(userId);
    }

    //유저의 특정 일정 가져오기
    @Get("/:calenderId")
    findCalenderById(@Req() req: any, @Param("calenderId") calenderId: string) {
        const userId = req.user.userId;
        return this.userCalenderService.findCalenderById(userId, calenderId);
    }

    //일정 수정하기
    @Put("/:calenderId")
    update(
        @Req() req: any,
        @Param("calenderId") calenderId: string,
        @Body() updateUserCalenderDto: UpdateUserCalenderDto,
    ) {
        const userId = req.user.userId;
        return this.userCalenderService.update(
            +userId,
            +calenderId,
            updateUserCalenderDto,
        );
    }

    //일정 삭제하기
    @Delete("/:calenderId")
    remove(@Req() req: any, @Param("calenderId") calenderId: string) {
        const userId = req.user.userId;
        return this.userCalenderService.remove(userId, +calenderId);
    }
}
