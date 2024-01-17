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
import { ClubApplication } from "./club-application.entity";
<<<<<<< HEAD
import { UserPosition } from "./user-position.entity";
=======
>>>>>>> ac3b4c1ce6086aa7463b44ba1ae6d1becd8cd882

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

    @OneToOne(() => ClubApplication, (clubApplication) => clubApplication.user)
    clubApplication: ClubApplication;

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
