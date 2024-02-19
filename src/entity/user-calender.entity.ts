import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { User } from "./user.entity";

//캘린더
@Entity({
    name: "userCalender", // 데이터베이스 테이블의 이름
})
export class UserCalender {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    date: Date;

    @Column()
    title: string;

    @Column({ nullable: true })
    description?: string;

    @Column()
    color: string;

    @ManyToOne(() => User, (user) => user.userCalender, { onDelete: "CASCADE" })
    @JoinColumn()
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ select: false })
    userId: number;
}
