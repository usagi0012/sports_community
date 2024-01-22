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

    @Column({ unique: true, nullable: false })
    chatId: number;

    @Column({ unique: true, nullable: false })
    userId: number;
    
    @Column()
    content: string;

    @CreateDateColumn({ type: "datetime", nullable: false })
    createdAt: Date;

    @DeleteDateColumn({ nullable: true })
    deletedAt?: Date;
}
