import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    OneToOne,
    Relation,
    ManyToOne,
    JoinTable,
} from "typeorm";
import { Club } from "./club.entity";

@Entity({
    name: "users", // 데이터베이스 테이블의 이름
})
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    clubId: number;

    @Column({ unique: true })
    email: string;

    @Column({ select: false })
    password: string;

    @Column({ nullable: true, select: false })
    currentRefreshToken?: string;

    @Column()
    name: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Club, (club) => club.users, { onDelete: "SET NULL" })
    @JoinTable()
    club: Club;
}
