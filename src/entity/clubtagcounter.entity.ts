import { IsInt, IsNumber, Max, Min } from "class-validator";
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

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
    @ApiProperty({ description: "북산" })
    buksan: number;

    @IsInt({ message: "숫자여야 합니다." })
    @Min(0, { message: "최소값은 0을 입력해야 합니다." })
    @Max(1, { message: "최댓값은 1을 입력해야 합니다." })
    @IsNumber()
    @Column()
    @ApiProperty({ description: "센안토니오" })
    sanantonio: number;

    @IsInt({ message: "숫자여야 합니다." })
    @Min(0, { message: "최소값은 0을 입력해야 합니다." })
    @Max(1, { message: "최댓값은 1을 입력해야 합니다." })
    @IsNumber()
    @Column()
    @ApiProperty({ description: "젠틀" })
    gentle: number;

    @IsInt({ message: "숫자여야 합니다." })
    @Min(0, { message: "최소값은 0을 입력해야 합니다." })
    @Max(1, { message: "최댓값은 1을 입력해야 합니다." })
    @IsNumber()
    @Column()
    @ApiProperty({ description: "매너" })
    manner: number;

    @IsInt({ message: "숫자여야 합니다." })
    @Min(0, { message: "최소값은 0을 입력해야 합니다." })
    @Max(1, { message: "최댓값은 1을 입력해야 합니다." })
    @IsNumber()
    @Column()
    @ApiProperty({ description: "레이커스" })
    lakers: number;

    @IsInt({ message: "숫자여야 합니다." })
    @Min(0, { message: "최소값은 0을 입력해야 합니다." })
    @Max(1, { message: "최댓값은 1을 입력해야 합니다." })
    @IsNumber()
    @Column()
    @ApiProperty({ description: "원맨팀" })
    oneman: number;

    @IsInt({ message: "숫자여야 합니다." })
    @Min(0, { message: "최소값은 0을 입력해야 합니다." })
    @Max(1, { message: "최댓값은 1을 입력해야 합니다." })
    @IsNumber()
    @Column()
    @ApiProperty({ description: "골스" })
    goldenstate: number;

    @IsInt({ message: "숫자여야 합니다." })
    @Min(0, { message: "최소값은 0을 입력해야 합니다." })
    @Max(1, { message: "최댓값은 1을 입력해야 합니다." })
    @IsNumber()
    @Column()
    @ApiProperty({ description: "낫배드" })
    notbed: number;

    @IsInt({ message: "숫자여야 합니다." })
    @Min(0, { message: "최소값은 0을 입력해야 합니다." })
    @Max(1, { message: "최댓값은 1을 입력해야 합니다." })
    @IsNumber()
    @Column()
    @ApiProperty({ description: "배드가이즈" })
    bed: number;

    @IsInt({ message: "숫자여야 합니다." })
    @Min(0, { message: "최소값은 0을 입력해야 합니다." })
    @Max(1, { message: "최댓값은 1을 입력해야 합니다." })
    @IsNumber()
    @Column()
    @ApiProperty({ description: "터프가이즈" })
    tough: number;

    @IsInt({ message: "숫자여야 합니다." })
    @Min(0, { message: "최소값은 0을 입력해야 합니다." })
    @Max(1, { message: "최댓값은 1을 입력해야 합니다." })
    @IsNumber()
    @Column()
    @ApiProperty({ description: "파이터즈" })
    fighter: number;

    @IsInt({ message: "숫자여야 합니다." })
    @Min(0, { message: "최소값은 0을 입력해야 합니다." })
    @Max(1, { message: "최댓값은 1을 입력해야 합니다." })
    @IsNumber()
    @Column()
    @ApiProperty({ description: "지각" })
    late: number;

    @IsInt({ message: "숫자여야 합니다." })
    @Min(0, { message: "최소값은 0을 입력해야 합니다." })
    @Max(1, { message: "최댓값은 1을 입력해야 합니다." })
    @IsNumber()
    @Column()
    @ApiProperty({ description: "파출리아가이즈" })
    zaza: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
