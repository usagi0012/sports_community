import { User } from "./user.entity";
import { Match } from "./match.entity";
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    ManyToOne,
    OneToMany,
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

@Entity({ name: "Recruit" })
export class Recruit {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("int")
    hostid: number;

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

    @Column({ type: "date" })
    gamedate: Date;

    @Column("int")
    runtime: number;

    @Column({
        type: "enum",
        enum: Rule,
    })
    rule: Rule;

    @Column()
    group: boolean;

    @Column("int")
    totalmember: number;

    @Column({
        type: "enum",
        enum: Status,
        default: Status.Recruiting,
    })
    status: Status;

    @ManyToOne(() => User, (user) => user.recruits)
    @JoinColumn({ name: "userId" })
    user: User;

    @OneToMany(() => Match, (match) => match.recruit)
    matches: Match[];
}
