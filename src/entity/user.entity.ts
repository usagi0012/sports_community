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
    Relation,
    ManyToOne,
    JoinTable,
} from "typeorm";
import { Club } from "./club.entity";
import { UserCalender } from "./user-calender.entity";
import { UserProfile } from "./user-profile.entity";
import { Recruit } from "./recruit.entity";
import { Match } from "./match.entity";

@Entity({
    name: "users",
})
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    clubId: number;

    @Column({ unique: true })
    email: string;

    @Column({ select: false })
    password: string;

    @Column({ nullable: true, select: false })
    currentRefreshToken?: string;

    @Column()
    name: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Club, (club) => club.users, { onDelete: "SET NULL" })
    @JoinTable()
    club: Club;

    @DeleteDateColumn()
    deletedAt: Date;

    @OneToMany(() => UserCalender, (userCalender) => userCalender.user)
    userCalender: UserCalender[];

    @OneToMany(() => Recruit, (recruit) => recruit.user)
    recruits: Recruit[];
    @OneToMany(() => Match, (match) => match.user)
    matches: Match[];
}
