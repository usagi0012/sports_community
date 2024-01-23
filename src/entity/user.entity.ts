import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
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
import { UserPosition } from "./user-position.entity";
import { IsBoolean } from "class-validator";
import { Report } from "./report.entity";
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";

@Entity({
    name: "users",
})
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    clubId?: number;

    @Column({ unique: true })
    email: string;

    @Column({ select: false })
    password: string;

    @Column({ nullable: true, select: false })
    currentRefreshToken?: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    verificationToken: string;

    @Column({ default: false })
    @IsBoolean()
    admin: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Club, (club) => club.users, { onDelete: "SET NULL" })
    @JoinTable()
    club: Club;

    @OneToOne(() => ClubApplication, (clubApplication) => clubApplication.user)
    clubApplication: ClubApplication;

    @DeleteDateColumn({ nullable: true, select: false })
    deletedAt?: Date;

    @OneToMany(() => UserCalender, (userCalender) => userCalender.user)
    userCalender: UserCalender[];

    @OneToMany(() => UserPosition, (userPosition) => userPosition.user)
    userPosition: UserPosition[];

    @OneToMany(() => Recruit, (recruit) => recruit.guest)
    recruits: Recruit[];

    @OneToMany(() => Match, (match) => match.user)
    matches: Match[];

    @OneToMany(() => Report, (report) => report.reportUser)
    reports: Report[];

    @OneToMany(() => Report, (report) => report.benUser)
    benReceived: Report[];
}
