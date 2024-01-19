import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from "typeorm";

@Entity()
export class Chat {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, nullable: false })
    title: string;

    @Column({ unique: true, nullable: false })
    creator: number;

    @CreateDateColumn({ type: "datetime", nullable: false })
    createdAt: Date;

    @UpdateDateColumn({ type: "datetime", nullable: false })
    updatedAt: Date;

    @DeleteDateColumn({ nullable: true })
    deletedAt?: Date;
}
