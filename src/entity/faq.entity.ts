import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity()
export class Faq {
    @PrimaryGeneratedColumn({ unsigned: true })
    @ApiProperty({ description: "id" })
    id: number;

    @IsNumber()
    @Column()
    userId: number;

    @IsNotEmpty({ message: "FAQ에 대한 제목을 입력해주세요." })
    @IsString()
    @Column()
    @ApiProperty({
        description: "제목",
        example: "FAQ",
    })
    title: string;

    @IsNotEmpty({ message: "FAQ에 대한 설명을 작성해주세요." })
    @IsString()
    @Column({ type: "text" })
    @ApiProperty({
        description: "설명",
        example: "저희 오농 커뮤니티 FAQ를 이용해주셔서 감사합니다.",
    })
    description: string;

    @CreateDateColumn()
    createAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
