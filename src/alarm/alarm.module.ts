import { Module } from "@nestjs/common";
import { Alarmservice } from "./alarm.service";

@Module({
    providers: [Alarmservice],
    exports: [Alarmservice],
})
export class AlarmserviceModule {}
