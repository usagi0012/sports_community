import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { User } from "./user.entity";
import { Recruit } from "./recruit.entity";

export enum MatchStatus {
    APPLICATION_COMPLETE = "신청완료",
    APPROVED = "승인",
    REJECTED = "거절",
}

@Entity({ name: "match" })
export class Match {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    message: string;

    @Column()
    guestid: number;

    @Column()
    hostid: number;

    @Column()
    recuritedid: number;

    @Column({
        type: "enum",
        enum: MatchStatus,
        default: MatchStatus.APPLICATION_COMPLETE,
    })
    status: MatchStatus;

    @ManyToOne(() => User, (user) => user.matches)
    @JoinColumn({ name: "userId" })
    user: User;

    @ManyToOne(() => Recruit, (recruit) => recruit.matches)
    @JoinColumn({ name: "recruitId" })
    recruit: Recruit;
}
