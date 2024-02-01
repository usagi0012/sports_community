import { Injectable } from "@nestjs/common";
import { Observable, Subject, filter, map } from "rxjs";
import { UserAlarmService } from "./../user-alarm/user-alarm.service";

// MessageEvent를 재정의합니다.
export interface CustomMessageEvent<T = any> {
    data: T;
}

@Injectable()
export class Alarmservice {
    private users$: Subject<any> = new Subject();

    constructor(private readonly userAlarmService: UserAlarmService) {}

    sendAlarm(userId: number, message: string): void {
        // 알림 전송 로직
        const eventData = { message };
        const event: CustomMessageEvent = { data: eventData };

        this.users$.next({ id: userId, event });
        this.userAlarmService.saveUserAlarm(userId, message);
    }

    getAlarmObservable(userId: number): Observable<CustomMessageEvent> {
        return this.users$.asObservable().pipe(
            filter((userEvent) => userEvent.id === userId),
            map((userEvent) => userEvent.event as CustomMessageEvent),
        );
    }
}
