import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { User } from "../../user/entities/user.entity";
import { Recruit } from "../../recruit/entities/recruit.entity";

@Entity()
export class Match {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    message: string;

    @ManyToOne(() => User, (user) => user.matches)
    @JoinColumn({ name: "userId" })
    user: User;

    @ManyToOne(() => Recruit, (recruit) => recruit.matches)
    @JoinColumn({ name: "recruitId" })
    recruit: Recruit;
}
