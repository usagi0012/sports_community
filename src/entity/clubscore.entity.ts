import { IsNotEmpty, IsNumber, Max, Min } from "class-validator";
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

import { ApiProperty } from "@nestjs/swagger";
import {
    MAX_SCORE,
    MIN_SCORE,
} from "src/personalassessmenttag/constants/score.constant";
import { Club } from "./club.entity";

@Entity({ name: "clubscore" })
export class Clubscore {
    @PrimaryGeneratedColumn({ unsigned: true })
    @ApiProperty({ description: "id" })
    id: number;

    @IsNumber()
    @Column()
    clubId: number;

    @IsNumber()
    @Column()
    @ApiProperty({ description: "성격" })
    personality: number;

    @IsNotEmpty({ message: "개인성격 점수를 입력해주세요." })
    @Min(MIN_SCORE, { message: "최소 점수는 1입니다." })
    @Max(MAX_SCORE, { message: "최대 점수는 5입니다." })
    @IsNumber()
    @ApiProperty({
        description: "성격",
        default: 1,
        example: "3",
    })
    @Column({
        type: "decimal",
        precision: 10,
        scale: 3,
        nullable: true,
        default: 0,
    })
    personalityAmount: number;

    @IsNumber()
    @Column({
        type: "decimal",
        precision: 10,
        scale: 3,
        nullable: true,
        default: 0,
    })
    @ApiProperty({ description: "실력" })
    ability: number;

    @IsNotEmpty({ message: "실력점수를 입력해주세요." })
    @Min(MIN_SCORE, { message: "최소 점수는 1입니다." })
    @Max(MAX_SCORE, { message: "최대 점수는 5입니다." })
    @IsNumber()
    @Column()
    @ApiProperty({
        description: "실력",
        default: 1,
        example: "3",
    })
    abilityAmount: number;

    @IsNotEmpty({ message: "MVP를 뽑아주세요." })
    @IsNumber()
    @Column()
    @ApiProperty({ description: "MVP", default: 1 })
    mvp: number;

    @IsNumber()
    @Column({ default: 0 })
    @ApiProperty({ description: "경기횟수" })
    count: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Club, (club) => club.clubscore)
    club: Club;
}
