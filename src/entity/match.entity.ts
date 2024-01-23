import { IsBoolean } from "class-validator";
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
import { User } from "./user.entity";
import { Recruit } from "./recruit.entity";
import { Userscore } from "./userscore.entity";
import { Personaltagcounter } from "./personaltagcounter.entity";

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
    message: string;

    @Column({ type: "datetime" })
    gameDate: Date;

    @Column({ type: "datetime" })
    endTime: Date;

    @Column()
    guestId: number;

    @Column()
    guestName: string;

    @Column()
    hostId: number;

    @Column()
    postId: number;

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
    @JoinColumn({ name: "userId" })
    user: User;

    @BeforeInsert()
    @BeforeUpdate()
    updateProgress() {
        const now = new Date();

        if (this.gameDate < now) {
            this.progress = Progress.DURING;
        }

        if (this.endTime < now) {
            this.progress = Progress.PLEASE_EVALUATE;
        }
    }
}
