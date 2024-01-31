import { IsInt, IsNumber, Max, Min } from "class-validator";
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Club } from "./club.entity";

@Entity({ name: "clubtagcounter" })
export class Clubtagcounter {
    @PrimaryGeneratedColumn({ unsigned: true })
    @ApiProperty({ description: "id" })
    id: number;

    @IsNumber()
    @Column()
    clubId: number;

    @IsInt({ message: "숫자여야 합니다." })
    @Min(0, { message: "최소값은 0을 입력해야 합니다." })
    @Max(1, { message: "최댓값은 1을 입력해야 합니다." })
    @IsNumber()
    @Column()
    @ApiProperty({
        description: "북산",
        example: "1",
    })
    buksan: number;

    @IsInt({ message: "숫자여야 합니다." })
    @Min(0, { message: "최소값은 0을 입력해야 합니다." })
    @Max(1, { message: "최댓값은 1을 입력해야 합니다." })
    @IsNumber()
    @Column()
    @ApiProperty({
        description: "센안토니오",
        example: "0",
    })
    sanantonio: number;

    @IsInt({ message: "숫자여야 합니다." })
    @Min(0, { message: "최소값은 0을 입력해야 합니다." })
    @Max(1, { message: "최댓값은 1을 입력해야 합니다." })
    @IsNumber()
    @Column()
    @ApiProperty({
        description: "젠틀",
        example: "1",
    })
    gentle: number;

    @IsInt({ message: "숫자여야 합니다." })
    @Min(0, { message: "최소값은 0을 입력해야 합니다." })
    @Max(1, { message: "최댓값은 1을 입력해야 합니다." })
    @IsNumber()
    @Column()
    @ApiProperty({
        description: "매너",
        example: "1",
    })
    manner: number;

    @IsInt({ message: "숫자여야 합니다." })
    @Min(0, { message: "최소값은 0을 입력해야 합니다." })
    @Max(1, { message: "최댓값은 1을 입력해야 합니다." })
    @IsNumber()
    @Column()
    @ApiProperty({
        description: "레이커스",
        example: "1",
    })
    lakers: number;

    @IsInt({ message: "숫자여야 합니다." })
    @Min(0, { message: "최소값은 0을 입력해야 합니다." })
    @Max(1, { message: "최댓값은 1을 입력해야 합니다." })
    @IsNumber()
    @Column()
    @ApiProperty({
        description: "원맨팀",
        example: "0",
    })
    oneman: number;

    @IsInt({ message: "숫자여야 합니다." })
    @Min(0, { message: "최소값은 0을 입력해야 합니다." })
    @Max(1, { message: "최댓값은 1을 입력해야 합니다." })
    @IsNumber()
    @Column()
    @ApiProperty({
        description: "골스",
        example: "1",
    })
    goldenstate: number;

    @IsInt({ message: "숫자여야 합니다." })
    @Min(0, { message: "최소값은 0을 입력해야 합니다." })
    @Max(1, { message: "최댓값은 1을 입력해야 합니다." })
    @IsNumber()
    @Column()
    @ApiProperty({
        description: "낫배드",
        example: "0",
    })
    notbed: number;

    @IsInt({ message: "숫자여야 합니다." })
    @Min(0, { message: "최소값은 0을 입력해야 합니다." })
    @Max(1, { message: "최댓값은 1을 입력해야 합니다." })
    @IsNumber()
    @Column()
    @ApiProperty({
        description: "배드가이즈",
        example: "1",
    })
    bed: number;

    @IsInt({ message: "숫자여야 합니다." })
    @Min(0, { message: "최소값은 0을 입력해야 합니다." })
    @Max(1, { message: "최댓값은 1을 입력해야 합니다." })
    @IsNumber()
    @Column()
    @ApiProperty({
        description: "터프가이즈",
        example: "0",
    })
    tough: number;

    @IsInt({ message: "숫자여야 합니다." })
    @Min(0, { message: "최소값은 0을 입력해야 합니다." })
    @Max(1, { message: "최댓값은 1을 입력해야 합니다." })
    @IsNumber()
    @Column()
    @ApiProperty({
        description: "파이터즈",
        example: "1",
    })
    fighter: number;

    @IsInt({ message: "숫자여야 합니다." })
    @Min(0, { message: "최소값은 0을 입력해야 합니다." })
    @Max(1, { message: "최댓값은 1을 입력해야 합니다." })
    @IsNumber()
    @Column()
    @ApiProperty({
        description: "지각",
        example: "1",
    })
    late: number;

    @IsInt({ message: "숫자여야 합니다." })
    @Min(0, { message: "최소값은 0을 입력해야 합니다." })
    @Max(1, { message: "최댓값은 1을 입력해야 합니다." })
    @IsNumber()
    @Column()
    @ApiProperty({
        description: "파출리아가이즈",
        example: "0",
    })
    zaza: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Club, (club) => club.clubtagcounter)
    club: Club;
}
