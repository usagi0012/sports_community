import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    OneToOne,
    Relation,
} from "typeorm";
import { Club } from "./club.entity";

@Entity({
    name: "users", // 데이터베이스 테이블의 이름
})
export class ClubApplication {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column({ unique: true, nullable: false })
    userId: string;

    @Column({ nullable: false })
    clubId: number;

    @Column()
    message: string;

    @Column()
    status: Enum;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
