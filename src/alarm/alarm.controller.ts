import { Controller, Param, Sse } from "@nestjs/common";
import { Alarmservice } from "./alarm.service";

@Controller("sse")
export class SseController {
    constructor(private readonly alarmService: Alarmservice) {}

    @Sse(":userId")
    sendClientAlarm(@Param("userId") userId: string) {
        return this.alarmService.sendClientAlarm(+userId);
    }
}
