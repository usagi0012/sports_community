import { Controller, Param, Sse } from "@nestjs/common";
import { Alarmservice } from "./alarm.service";
import { Observable } from "rxjs";
import { CustomMessageEvent } from "./alarm.service"; // 이 부분을 추가

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
