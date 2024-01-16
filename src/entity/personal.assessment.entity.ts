import { IsNotEmpty, IsNumber, Max, Min } from "class-validator";
import { MAX_SCORE, MIN_SCORE } from "src/assessment/constants/score.constant";
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Personaltag } from "./personal.assessment.tag.entity";
import { User } from "./user.entity";

@Entity({ name: "user_scroe" })
export class Userscore {
    @PrimaryGeneratedColumn({ unsigned: true })
    id: number;

    @Column({ unsigned: true })
    tagId: number;

    @IsNotEmpty({ message: "개인성격 점수를 입력해주세요." })
    @Min(MIN_SCORE, { message: "최소 점수는 1입니다." })
    @Max(MAX_SCORE, { message: "최대 점수는 5입니다." })
    @IsNumber()
    personality: number;

    @IsNotEmpty({ message: "실력점수를 입력해주세요." })
    @Min(MIN_SCORE, { message: "최소 점수는 1입니다." })
    @Max(MAX_SCORE, { message: "최대 점수는 5입니다." })
    @IsNumber()
    @Column()
    ability: number;

    @IsNotEmpty({ message: "MVP를 뽑아주세요." })
    @IsNumber()
    @Column()
    mvp: number;

    @IsNumber()
    @Column()
    count: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Personaltag, (personaltag) => personaltag.userscore, {
        cascade: true,
    })
    tag: Personaltag[];

    @OneToOne(() => User, (user) => user.userscore)
    @JoinColumn()
    user: User;
}
