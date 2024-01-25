import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    JoinColumn,
} from "typeorm";
import { User } from "./user.entity";
export enum Progress {
    APPROVED = "승인",
    REJECTED = "거절",
    EVALUATION_COMPLETED = "신고 완료",
}
@Entity({
    name: "reports",
})
export class Report {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    reportContent: string;

    @Column({
        type: "enum",
        enum: Progress,
        default: Progress.EVALUATION_COMPLETED,
    })
    progress: Progress;

    @Column()
    reportUserId: number;

    @Column()
    banUserId: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.reports)
    @JoinColumn({ name: "reportUserId" })
    reportUser: User;

    @ManyToOne(() => User, (user) => user.banReceived)
    @JoinColumn({ name: "banUserId" })
    banUser: User;
}
