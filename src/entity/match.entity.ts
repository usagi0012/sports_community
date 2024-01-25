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
    CONFIRM = "학인",
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
    message: string;

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

    @ManyToOne(() => User, (user) => user.matches)
    @JoinColumn({ name: "guestId" })
    guest: User;

    @BeforeInsert()
    @BeforeUpdate()
    updateProgress() {
        const now = new Date();

        if (this.gameDate <= now && this.endTime > now) {
            this.progress = Progress.DURING;
        } else if (
            this.endTime <= now &&
            this.progress !== Progress.EVALUATION_COMPLETED
        ) {
            this.progress = Progress.PLEASE_EVALUATE;
        }
    }
}
