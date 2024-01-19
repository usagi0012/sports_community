import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from "typeorm";

@Entity()
export class Participants {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, nullable: false })
    userId: number;

    @Column({ unique: true, nullable: false })
    chatId: number;

    @CreateDateColumn({ type: "datetime", nullable: false })
    createdAt: Date;

    @UpdateDateColumn({ type: "datetime", nullable: false })
    updatedAt: Date;
}
