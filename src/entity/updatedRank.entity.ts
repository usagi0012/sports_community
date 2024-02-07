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
export class UpdatedRank {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    userId: number;

    @Column({ nullable: false })
    personalityScore: number;

    @Column({ nullable: false })
    ablilityScore: number;

    @CreateDateColumn({ type: "datetime", nullable: false })
    createdAt: Date;

    @UpdateDateColumn({ type: "datetime", nullable: false })
    updatedAt: Date;
}
