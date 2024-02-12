import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    OneToOne,
    Relation,
    JoinTable,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { Club } from "./club.entity";
import { User } from "./user.entity";

@Entity({
    name: "memberRank",
})
export class MemberRank {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    userId: number;

    @Column()
    isPersonality: boolean;

    @Column()
    isAbility: boolean;

    @Column({
        type: "decimal",
        precision: 10,
        scale: 3,
        nullable: true,
        default: 0,
    })
    personalityScore: number;

    @Column({
        type: "decimal",
        precision: 10,
        scale: 3,
        nullable: true,
        default: 0,
    })
    abilityScore: number;

    @CreateDateColumn({ type: "datetime", nullable: false })
    createdAt: Date;

    @UpdateDateColumn({ type: "datetime", nullable: false })
    updatedAt: Date;
}
