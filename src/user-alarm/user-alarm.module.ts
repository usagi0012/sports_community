import { Module } from "@nestjs/common";
import { UserAlarmService } from "./user-alarm.service";
import { UserAlarmController } from "./user-alarm.controller";
import { User } from "../entity/user.entity";
import { UserAlarm } from "../entity/userAlarm.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
    imports: [TypeOrmModule.forFeature([UserAlarm, User]), ScheduleModule],
    controllers: [UserAlarmController],
    providers: [UserAlarmService],
})
export class UserAlarmModule {}
