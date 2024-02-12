import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    BeforeInsert,
    BeforeUpdate,
} from "typeorm";
import { Club } from "./club.entity";
import { IsNotEmpty } from "class-validator";

export enum ClubMatchStatus {
    APPLICATION_COMPLETE = "신청완료",
    APPROVED = "승인",
    REJECTED = "거절",
    APPROVECONFIRM = "호스트 승인(게스트 클럽은 컴펌을 눌러주세요!)",
    CANCEL = "취소",
    MATCHSUCCESS = "매치 성사",
}
export enum Progress {
    BEFORE = "경기전",
    DURING = "경기중",
    PLEASE_EVALUATE = "평가해주세요",
    EVALUATION_COMPLETED = "평가 완료",
}
@Entity()
export class ClubMatch {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    message: string;

    @Column()
    information: string;
    @Column({
        type: "enum",
        enum: ClubMatchStatus,
        default: ClubMatchStatus.APPLICATION_COMPLETE,
    })
    status: ClubMatchStatus;

    @IsNotEmpty()
    @Column()
    host_clubId: number;

    @IsNotEmpty()
    @Column()
    host_clubId_master: number;

    @IsNotEmpty()
    @Column()
    host_club_name: string;

    @Column({ type: "boolean", default: false })
    host_evaluate: boolean;

    @IsNotEmpty()
    @Column()
    guest_clubId: number;

    @IsNotEmpty()
    @Column()
    guest_clubId_master: number;

    @IsNotEmpty()
    @Column()
    guest_club_name: string;

    @Column({ type: "boolean", default: false })
    guest_evaluate: boolean;

    @ManyToOne(() => Club)
    hostClub: Club;

    @ManyToOne(() => Club)
    guestClub: Club;

    @Column({ type: "datetime" })
    gameDate: Date;

    @Column({ type: "datetime" })
    endTime: Date;

    @Column({
        type: "enum",
        enum: Progress,
        default: Progress.BEFORE,
    })
    progress: Progress;

    // @BeforeInsert()
    // @BeforeUpdate()
    // updateProgress() {
    //     const now = new Date();
    //     const utc = now.getTime();
    //     const koreaTimeDiff = 9 * 60 * 60 * 1000;
    //     const korNow = new Date(utc + koreaTimeDiff);

    //     if (this.gameDate < korNow) {
    //         this.progress = Progress.DURING;
    //     }

    //     if (this.endTime < korNow) {
    //         this.progress = Progress.PLEASE_EVALUATE;
    //     }
    // }

    static setEndTimeFromNumber(gameDate: Date, durationInHours: number): Date {
        const adjustedGameDate = new Date(
            gameDate.getTime() + 9 * 60 * 60 * 1000,
        );

        const futureEndTime = new Date(
            adjustedGameDate.getTime() + durationInHours * 60 * 60 * 1000,
        );
        return futureEndTime;
    }

    static korGameDate(gameDate: Date): Date {
        const adjustedGameDate = new Date(
            gameDate.getTime() + 9 * 60 * 60 * 1000,
        );
        return adjustedGameDate;
    }
}
