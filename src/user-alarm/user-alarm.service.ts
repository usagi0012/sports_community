import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserAlarm } from "../entity/userAlarm.entity";
import { Cron, CronExpression } from "@nestjs/schedule";
import { LessThanOrEqual } from "typeorm";

@Injectable()
export class UserAlarmService {
    constructor(
        @InjectRepository(UserAlarm)
        private userAlarmRepository: Repository<UserAlarm>,
    ) {}

    //알람 온거 저장
    async saveUserAlarm(
        userId: number,
        message: string,
        link?: string,
    ): Promise<void> {
        const newAlarm = this.userAlarmRepository.create({
            user: { id: userId },
            message,
            link,
        });
        await this.userAlarmRepository.save(newAlarm);
    }

    //내 알람온거 확인
    async getUserAlarms(userId: number) {
        const getAlarms = await this.userAlarmRepository.find({
            where: { user: { id: userId } },
            order: { createdAt: "desc" },
        });
        return {
            statusCode: 200,
            message: "나에게 온 알람 조회.",
            data: { getAlarms },
        };
    }

    //알람 삭제
    async deleteUserAlarm(userId, alarmId: number): Promise<void> {
        await this.userAlarmRepository.delete(alarmId);
    }

    //1주일이 지나면 db의 알람이 자동으로삭제 (created_at 으로부터)
    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async handleCron() {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        await this.userAlarmRepository.delete({
            createdAt: LessThanOrEqual(oneWeekAgo),
        });
    }
}
