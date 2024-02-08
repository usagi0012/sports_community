import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from "typeorm";

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    roomId: number;

    @Column({ nullable: false })
    userId: number;

    @Column({ nullable: false })
    userName: string;

    @Column()
    content: string;

    @CreateDateColumn({ type: "datetime", nullable: false })
    createdAt: Date;

    @DeleteDateColumn({ nullable: true })
    deletedAt?: Date;
}
