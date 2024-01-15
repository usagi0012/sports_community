import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { User } from "./user.entity";
import { Recruit } from "./recruit.entity";

@Entity({ name: "match" })
export class Match {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    message: string;

    @Column()
    hostid: number;

    @Column()
    recuritedid: number;

    @ManyToOne(() => User, (user) => user.matches)
    @JoinColumn({ name: "userId" })
    user: User;

    @ManyToOne(() => Recruit, (recruit) => recruit.matches)
    @JoinColumn({ name: "recruitId" })
    recruit: Recruit;
}
