import { IsNotEmpty, IsNumber, Max, Min } from "class-validator";
import { MAX_SCORE, MIN_SCORE } from "src/assessment/constants/score.constant";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Clubtag } from "./club.assessment.tag.entity";

@Entity({
    name: "club_score",
})
export class Clubscore {
    @PrimaryGeneratedColumn({ unsigned: true })
    id: number;

    @Column({ unsigned: true })
    clubId: number;

    @IsNotEmpty({ message: "개인성격 점수를 입력해주세요." })
    @Min(MIN_SCORE, { message: "최소 점수는 1입니다." })
    @Max(MAX_SCORE, { message: "최대 점수는 5입니다." })
    personality: number;

    @IsNotEmpty({ message: "실력점수를 입력해주세요." })
    @Min(MIN_SCORE, { message: "최소 점수는 1입니다." })
    @Max(MAX_SCORE, { message: "최대 점수는 5입니다." })
    ability: number;

    @IsNotEmpty({ message: "MVP를 뽑아주세요." })
    @IsNumber()
    @Column()
    mvp: number;

    @IsNumber()
    @Column()
    count: number;

    @OneToMany(() => Clubtag, (clubtag) => clubtag.clubscore)
    tag: Clubtag[];
}
