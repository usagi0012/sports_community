import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    Relation,
    DeleteDateColumn,
} from "typeorm";
import { User } from "./user.entity";

@Entity({
    name: "alarms",
})
export class UserAlarm {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    message: string;

    @CreateDateColumn()
    createdAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @ManyToOne(() => User, (user) => user.userAlarm, {
        nullable: true,
        onDelete: "CASCADE",
    })
    user: Relation<User>;
}
