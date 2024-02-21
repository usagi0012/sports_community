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

    @Column({ select: false })
    userId: number;
}
