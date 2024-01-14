import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.entity";
import { UserProfile } from "./user-profile.entity";

@Entity({
    name: "userPosition", // 데이터베이스 테이블의 이름
})
export class UserPosition {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    guard: boolean;

    @Column()
    center: boolean;

    @Column({ nullable: true })
    foward: boolean;

    @OneToOne(() => UserProfile, (userProfile) => userProfile.userPosition)
    @JoinColumn()
    userProfile: UserProfile;
}
