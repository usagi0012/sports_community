import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.entity";

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

    @Column()
    forward: boolean;

    @OneToOne(() => User, { onDelete: "CASCADE" })
    @JoinColumn()
    user: User;

    @Column({ select: false }) // 필요한 경우에만 선택적으로 가져올 수 있도록 설정
    userId: number; // user.id를 저장하는 필드 추가
}
