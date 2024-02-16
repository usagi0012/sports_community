import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { QnaComment } from "./qnaComment.entity";

@Entity()
export class Qna {
    @PrimaryGeneratedColumn({ unsigned: true })
    @ApiProperty({ description: "id" })
    id: number;

    @IsNumber()
    @Column({ unsigned: true })
    userId: number;

    @IsString()
    @Column()
    userName: string;

    @IsNotEmpty({ message: "QNA에 대한 제목을 입력해주세요." })
    @IsString()
    @Column()
    @ApiProperty({
        description: "제목",
        example: "QNA",
    })
    title: string;

    @IsNotEmpty({ message: "QNA에 대한 설명을 작성해주세요." })
    @IsString()
    @Column({ type: "text" })
    @ApiProperty({
        description: "설명",
        example: "저희 오농 커뮤니티 QNA를 이용해주셔서 감사합니다.",
    })
    description: string;

    @Column({ nullable: true })
    image: string;

    @CreateDateColumn()
    createAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => QnaComment, (qnaComment) => qnaComment.qna, {
        cascade: true,
    })
    qnaComment: QnaComment[];
}
