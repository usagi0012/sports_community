import { Controller, Param, Req, Sse, UseGuards } from "@nestjs/common";
import { Alarmservice } from "./alarm.service";
import { Observable } from "rxjs";
import { CustomMessageEvent } from "./alarm.service";
import { ApiBearerAuth } from "@nestjs/swagger";
import { accessTokenGuard } from "src/auth/guard/access-token.guard";
import { Request } from "express";

@Controller("sse")
export class SseController {
    constructor(private readonly alarmService: Alarmservice) {}

    @Sse(":userId")
    sendCustomAlarm(
        @Req() req: Request,
        @Param("userId")
        userId: string,
    ): Observable<CustomMessageEvent> {
        req.on("close", () => {
            console.log(`${userId} 사용자가 접속을 종료했습니다.`);
        });
        return this.alarmService.getAlarmObservable(+userId);
    }
}
