import {
    Column,
    CreateDateColumn,
    Entity,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Userscore } from "./personal.assessment.entity";

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

    @OneToOne(() => Userscore, (userscroe) => userscroe.user, { cascade: true })
    userscore: Userscore;
}
