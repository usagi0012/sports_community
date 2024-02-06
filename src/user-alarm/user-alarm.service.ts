import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserAlarm } from "../entity/userAlarm.entity";

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
}
