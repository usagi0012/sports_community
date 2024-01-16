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

    @ManyToOne(() => User, (user) => user.userCalender)
    @JoinColumn()
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ select: false }) // 필요한 경우에만 선택적으로 가져올 수 있도록 설정
    userId: number; // user.id를 저장하는 필드 추가
}
