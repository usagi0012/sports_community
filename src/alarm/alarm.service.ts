import { Injectable, MessageEvent } from "@nestjs/common";
import { Observable, Subject, filter, map } from "rxjs";

@Injectable()
export class Alarmservice {
    private users$: Subject<any> = new Subject();

    private observer = this.users$.asObservable();

    emitCardChangeEvent(userId: number) {
        // next를 통해 이벤트를생성
        this.users$.next({ id: userId });
    }

    sendClientAlarm(userId: number): Observable<any> {
        // 이벤트 발생시 처리 로직
        return this.observer.pipe(
            // 유저 필터링
            filter((user) => user.id === userId),
            // 데이터 전송
            map((user) => {
                return {
                    data: {
                        message: "카드의 담당자가 사용자님으로 변경되었습니다.",
                    },
                } as MessageEvent;
            }),
        );
    }
}
