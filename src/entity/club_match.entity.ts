import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { Club } from "./club.entity";
import { IsNotEmpty } from "class-validator";

export enum ClubMatchStatus {
    APPLICATION_COMPLETE = "신청완료",
    APPROVED = "승인",
    REJECTED = "거절",
    CANCEL = "취소",
}

@Entity()
export class ClubMatch {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    message: string;

    @Column()
    Information: string;
    @Column({
        type: "enum",
        enum: ClubMatchStatus,
        default: ClubMatchStatus.APPLICATION_COMPLETE,
    })
    status: ClubMatchStatus;

    @IsNotEmpty()
    @Column()
    host_clubId: number;

    @IsNotEmpty()
    @Column()
    host_clubId_master: number;

    @IsNotEmpty()
    @Column()
    host_club_name: string;

    @IsNotEmpty()
    @Column()
    guest_clubId: number;

    @IsNotEmpty()
    @Column()
    guest_clubId_master: number;

    @IsNotEmpty()
    @Column()
    guest_club_name: string;

    @ManyToOne(() => Club)
    hostClub: Club;

    @ManyToOne(() => Club)
    guestClub: Club;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
