import { Module } from "@nestjs/common";
import { Alarmservice } from "./alarm.service";
import { UserAlarmService } from "../user-alarm/user-alarm.service";
import { User } from "src/entity/user.entity";
import { UserAlarm } from "src/entity/userAlarm.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
@Module({
    imports: [TypeOrmModule.forFeature([User, UserAlarm])],
    providers: [Alarmservice, UserAlarmService, User],
    exports: [Alarmservice],
})
export class AlarmserviceModule {}
