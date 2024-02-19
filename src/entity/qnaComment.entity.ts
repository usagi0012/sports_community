import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Qna } from "./qna.entity";

@Entity()
export class QnaComment {
    @PrimaryGeneratedColumn({ unsigned: true })
    @ApiProperty({ description: "id" })
    id: number;

    @IsNumber()
    @Column({ unsigned: true })
    masterId: number;

    @IsString()
    @Column()
    masterName: string;

    @IsNumber()
    @Column({ unsigned: true })
    qnaId: number;

    @IsNotEmpty({ message: "QNA에 대한 댓글을 작성해주세요." })
    @IsString()
    @Column({ type: "text" })
    @ApiProperty({
        description: "댓글",
        example:
            "저희 오농은 언제나 고객을 위한 편리서비스를 제공하려고 노력합니다.",
    })
    comment: string;

    @CreateDateColumn()
    createAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Qna, (qna) => qna.qnaComment)
    @JoinColumn({ name: "qnaId" })
    qna: Qna;
}
