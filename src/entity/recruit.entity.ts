import { User } from "./user.entity";
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    ManyToOne,
    BeforeInsert,
    BeforeUpdate,
} from "typeorm";

export enum Region {
    Region1 = "Region1",
    Region2 = "Region2",
}

export enum Rule {
    threeOnThree = "3대3",
    fourOnFour = "4대4",
    fiveOnFive = "5대5",
}

export enum Status {
    Recruiting = "모집중",
    Complete = "모집완료",
}

export enum Progress {
    BEFORE = "경기전",
    DURING = "경기중",
    PLEASE_EVALUATE = "평가해주세요",
    EVALUATION_COMPLETED = "평가 완료",
}

@Entity({ name: "Recruit" })
export class Recruit {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    hostId: number;

    @Column("varchar")
    hostName: string;

    @Column("varchar")
    title: string;

    @Column({
        type: "enum",
        enum: Region,
    })
    region: Region;

    @Column("varchar")
    gps: string;

    @Column("varchar")
    content: string;

    @Column({ type: "datetime" })
    gamedate: Date;

    @Column({ type: "datetime" })
    endtime: Date;

    @Column("int")
    runtime: number;

    @Column({
        type: "enum",
        enum: Rule,
    })
    rule: Rule;

    @Column()
    basictotalmember: number;

    @Column("int")
    totalmember: number;

    @Column({
        type: "enum",
        enum: Status,
        default: Status.Recruiting,
    })
    status: Status;

    @Column({
        type: "enum",
        enum: Progress,
        default: Progress.BEFORE,
    })
    progress: Progress;

    @ManyToOne(() => User, (user) => user.recruits)
    @JoinColumn({ name: "hostId" })
    host: User;

    @BeforeInsert()
    @BeforeUpdate()
    updateProgress() {
        const now = new Date();

        if (this.gamedate < now) {
            this.progress = Progress.DURING;
        }

        if (this.endtime < now) {
            this.progress = Progress.PLEASE_EVALUATE;
        }
    }
}
