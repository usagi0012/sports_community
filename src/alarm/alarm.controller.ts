import { Controller, Param, Sse, UseGuards } from "@nestjs/common";
import { Alarmservice } from "./alarm.service";
import { Observable } from "rxjs";
import { CustomMessageEvent } from "./alarm.service"; // 이 부분을 추가
import { ApiBearerAuth } from "@nestjs/swagger";
import { accessTokenGuard } from "src/auth/guard/access-token.guard";

@Controller("sse")
export class SseController {
    constructor(private readonly alarmService: Alarmservice) {}

    @Sse(":userId")
    sendCustomAlarm(
        @Param("userId") userId: string,
    ): Observable<CustomMessageEvent> {
        return this.alarmService.getAlarmObservable(+userId);
    }
}
