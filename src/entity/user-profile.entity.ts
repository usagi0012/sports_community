import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

import { User } from "./user.entity";
import { UserPosition } from "./user-position.entity";
import { Userscore } from "./userscore.entity";
import { Clubscore } from "./clubscore.entity";
import { Personaltagcounter } from "./personaltagcounter.entity";

export enum Gender {
    MALE = "male",
    FEMALE = "female",
}

//유저 프로필
@Entity({
    name: "userProfile", // 데이터베이스 테이블의 이름
})
export class UserProfile {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    nickname: string;

    @Column({
        type: "enum",
        enum: Gender,
    })
    gender: Gender;

    @Column({ nullable: true })
    description?: string;

    @Column()
    image: string;

    @Column()
    height: number;

    @OneToOne(() => User, { onDelete: "CASCADE" })
    @JoinColumn()
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ select: false }) // 필요한 경우에만 선택적으로 가져올 수 있도록 설정
    userId: number; // user.id를 저장하는 필드 추가

    @OneToOne(() => Userscore, (userscore) => userscore.userProfile, {
        cascade: true,
    })
    userscore: Userscore;

    @OneToOne(
        () => Personaltagcounter,
        (personaltagcounter) => personaltagcounter.userProfile,
        { cascade: true },
    )
    personaltagcounter: Personaltagcounter;
}
