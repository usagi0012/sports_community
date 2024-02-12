import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity({
    name: "updatedMemberRank",
})
export class UpdatedMemberRank {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    userId: number;

    @Column()
    isPersonality: boolean;

    @Column()
    isAbility: boolean;

    @Column()
    personalityScore: number;

    @Column()
    ablilityScore: number;

    @CreateDateColumn({ type: "datetime", nullable: false })
    createdAt: Date;

    @UpdateDateColumn({ type: "datetime", nullable: false })
    updatedAt: Date;
}
