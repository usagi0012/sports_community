import { Controller, Get, Param, Delete, UseGuards } from "@nestjs/common";
import { UserAlarmService } from "./user-alarm.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { accessTokenGuard } from "src/auth/guard/access-token.guard";
import { UserId } from "src/auth/decorators/userId.decorator";

@ApiTags("알람 기능")
@ApiBearerAuth("accessToken")
@UseGuards(accessTokenGuard)
@Controller("userAlarm")
export class UserAlarmController {
    constructor(private readonly userAlarmService: UserAlarmService) {}

    @Get()
    async getUserAlarms(@UserId() userId: number) {
        const alarms = await this.userAlarmService.getUserAlarms(+userId);
        return alarms;
    }

    @Delete("/:alarmId")
    async deleteUserAlarm(
        @UserId() userId: number,
        @Param("alarmId") alarmId: string,
    ) {
        await this.userAlarmService.deleteUserAlarm(+userId, +alarmId);
        return { message: "Alarm deleted successfully" };
    }
}
