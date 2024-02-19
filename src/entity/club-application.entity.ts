import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    OneToOne,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { Club } from "./club.entity";
import { User } from "./user.entity";

export enum ClubApplicationStatus {
    BEFORE_APPLICATION = "신청 접수중",
    IN_PROGRESS = "신청 검토중",
    APPLICATION_COMPLETED = "신청 완료",
    APPROVED = "요청 승인",
    REJECTED = "요청 거절",
}
@Entity({
    name: "clubApplications",
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

    @CreateDateColumn({ type: "datetime", nullable: false })
    createdAt: Date;

    @UpdateDateColumn({ type: "datetime", nullable: false })
    updatedAt: Date;

    //user 테이블과 연결하기
    @OneToOne(() => User, (user) => user.clubApplication)
    @JoinColumn({ name: "userId" })
    user: User;

    //club 테이블과 연결하기
    @ManyToOne(() => Club, (club) => club.clubApplications)
    @JoinColumn({ name: "clubId" })
    club: Club;
}
