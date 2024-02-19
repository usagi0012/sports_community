import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    OneToMany,
    BeforeUpdate,
    BeforeInsert,
} from "typeorm";
import { Recruit } from "./recruit.entity";
import { User } from "./user.entity";

export enum MatchStatus {
    APPLICATION_COMPLETE = "신청완료",
    APPROVED = "승인",
    REJECTED = "거절",
    CANCEL = "취소",
    CONFIRM = "확인",
    CANCELCONFIRM = "취소한 매치",
}

export enum Progress {
    BEFORE = "경기전",
    DURING = "경기중",
    PLEASE_EVALUATE = "평가해주세요",
    EVALUATION_COMPLETED = "평가 완료",
}

@Entity({ name: "match" })
export class Match {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    guestId: number;

    @Column()
    guestName: string;

    @Column()
    hostId: number;

    @Column()
    hostName: string;

    @Column()
    recruitId: number;

    @Column()
    recruitTitle: string;

    @Column()
    message: string;

    @Column()
    gps: string;
    @Column({ type: "datetime" })
    gameDate: Date;

    @Column({ type: "datetime" })
    endTime: Date;

    @Column({ default: false })
    evaluate: boolean;

    @Column({
        type: "enum",
        enum: MatchStatus,
        default: MatchStatus.APPLICATION_COMPLETE,
    })
    status: MatchStatus;

    @Column({
        type: "enum",
        enum: Progress,
        default: Progress.BEFORE,
    })
    progress: Progress;

    @Column("simple-array", { nullable: true })
    evaluateUser: string[];

    @ManyToOne(() => User, (user) => user.matches)
    @JoinColumn({ name: "guestId" })
    guest: User;

    @BeforeInsert()
    @BeforeUpdate()
    updateProgress() {
        const now = new Date();
        const utc = now.getTime();
        const koreaTimeDiff = 9 * 60 * 60 * 1000;
        const korNow = new Date(utc + koreaTimeDiff);

        if (this.gameDate <= korNow && this.endTime > korNow) {
            this.progress = Progress.DURING;
        } else if (
            this.endTime <= korNow &&
            this.progress !== Progress.EVALUATION_COMPLETED
        ) {
            this.progress = Progress.PLEASE_EVALUATE;
        }
    }
}
