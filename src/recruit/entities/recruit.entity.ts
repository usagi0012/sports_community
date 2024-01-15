import { User } from "src/user/entities/user.entity";
import { Match } from "src/match/entities/match.entity";
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    ManyToOne,
    OneToMany,
} from "typeorm";

export enum Region {}

export enum Rule {
    threeOnThree = "3대3",
    fourOnFour = "4대4",
    fiveOnFive = "5대5",
    clubMatch = "동아리전",
}

export enum Status {
    Recruiting = "모집중",
    Complete = "모집완료",
}

@Entity()
export class Recruit {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({
        type: "enum",
        enum: Region,
    })
    region: Region;

    @Column()
    gps: string;

    @Column()
    content: string;

    @Column({ type: "date" })
    gamedate: Date;

    @Column()
    runtime: number;

    @Column({
        type: "enum",
        enum: Rule,
    })
    rule: Rule;

    @Column()
    group: boolean;

    @Column()
    totalmember: number;

    @Column({
        type: "enum",
        enum: Status,
    })
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
