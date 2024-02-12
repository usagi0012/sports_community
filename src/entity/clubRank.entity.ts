import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity({
    name: "clubRank",
})
export class ClubRank {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    clubId: number;

    @Column()
    totalScore: number;

    @CreateDateColumn({ type: "datetime", nullable: false })
    createdAt: Date;

    @UpdateDateColumn({ type: "datetime", nullable: false })
    updatedAt: Date;
}
