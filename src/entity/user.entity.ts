import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Userscore } from "./userscore.entity";
import { Personaltagcounter } from "./personaltagcounter.entity";

@Entity({
    name: "users", // 데이터베이스 테이블의 이름
})
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    currentRefreshToken?: string;

    @Column()
    name: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToOne(() => Userscore, (userscroe) => userscroe.user, { cascade: true })
    userscore: Userscore;

    @OneToMany(
        () => Personaltagcounter,
        (personaltagcounter) => personaltagcounter.user,
        { cascade: true },
    )
    personaltagcounter: Personaltagcounter[];
}
