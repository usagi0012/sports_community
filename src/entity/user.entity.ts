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

@Entity({
    name: "users", // 데이터베이스 테이블의 이름
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

    @OneToOne(() => UserProfile, (userProfile) => userProfile.user)
    @JoinColumn()
    userProfile: UserProfile;

    @OneToMany(() => UserCalender, (userCalender) => userCalender.user)
    userCalender: UserCalender[];
}
