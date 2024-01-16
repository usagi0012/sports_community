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

enum ClubApplicationStatus {
    BEFORE_APPLICATION = "신청 접수중",
    IN_PROGRESS = "신청 검토중",
    APPLICATION_COMPLETED = "신청 완료",
}
@Entity({
    name: "users", // 데이터베이스 테이블의 이름
})
export class ClubApplication {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, nullable: false })
    userId: number;

    @Column({ nullable: false })
    clubId: number;

    @Column()
    message: string;

    @Column({
        type: "enum",
        enum: ClubApplicationStatus,
        default: ClubApplicationStatus.BEFORE_APPLICATION,
    })
    status: ClubApplicationStatus;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
