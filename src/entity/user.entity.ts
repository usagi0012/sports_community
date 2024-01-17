import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { UserCalender } from "./user-calender.entity";
import { UserProfile } from "./user-profile.entity";
import { Recruit } from "./recruit.entity";
import { Match } from "./match.entity";
import { UserPosition } from "./user-position.entity";

@Entity({
    name: "users",
})
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    currentRefreshToken?: string;

    @Column()
    name: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @OneToMany(() => UserCalender, (userCalender) => userCalender.user)
    userCalender: UserCalender[];

    @OneToMany(() => UserPosition, (userPosition) => userPosition.user)
    userPosition: UserPosition[];

    @OneToMany(() => Recruit, (recruit) => recruit.user)
    recruits: Recruit[];
    @OneToMany(() => Match, (match) => match.user)
    matches: Match[];
}
