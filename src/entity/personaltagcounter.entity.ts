import { IsInt, IsNotEmpty, IsNumber, Max, Min } from "class-validator";
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { UserProfile } from "./user-profile.entity";

@Entity({ name: "personaltagcounter" })
export class Personaltagcounter {
    @PrimaryGeneratedColumn({ unsigned: true })
    @ApiProperty({ description: "id" })
    id: number;

    @IsNumber()
    @Column()
    profileId: number;

    @IsInt({ message: "숫자여야 합니다." })
    @Min(0, { message: "최소값은 0을 입력해야 합니다." })
    @Max(1, { message: "최댓값은 1을 입력해야 합니다." })
    @IsNotEmpty()
    @IsNumber()
    @Column()
    @ApiProperty({
        description: "조던",
        example: "0",
    })
    jorden: number;

    @IsInt({ message: "숫자여야 합니다." })
    @Min(0, { message: "최소값은 0을 입력해야 합니다." })
    @Max(1, { message: "최댓값은 1을 입력해야 합니다." })
    @IsNotEmpty()
    @IsNumber()
    @Column()
    @ApiProperty({
        description: "정대만",
        example: "1",
    })
    daeman: number;

    @IsInt({ message: "숫자여야 합니다." })
    @Min(0, { message: "최소값은 0을 입력해야 합니다." })
    @Max(1, { message: "최댓값은 1을 입력해야 합니다." })
    @IsNotEmpty()
    @IsNumber()
    @Column()
    @ApiProperty({
        description: "서태웅",
        example: "1",
    })
    teawoong: number;

    @IsInt({ message: "숫자여야 합니다." })
    @Min(0, { message: "최소값은 0을 입력해야 합니다." })
    @Max(1, { message: "최댓값은 1을 입력해야 합니다." })
    @IsNotEmpty()
    @IsNumber()
    @Column()
    @ApiProperty({
        description: "채치수",
        example: "0",
    })
    chisu: number;

    @IsInt({ message: "숫자여야 합니다." })
    @Min(0, { message: "최소값은 0을 입력해야 합니다." })
    @Max(1, { message: "최댓값은 1을 입력해야 합니다." })
    @IsNotEmpty()
    @IsNumber()
    @Column()
    @ApiProperty({
        description: "커리",
        example: "1",
    })
    curry: number;

    @IsInt({ message: "숫자여야 합니다." })
    @Min(0, { message: "최소값은 0을 입력해야 합니다." })
    @Max(1, { message: "최댓값은 1을 입력해야 합니다." })
    @IsNotEmpty()
    @IsNumber()
    @Column()
    @ApiProperty({
        description: "어빙",
        example: "0",
    })
    irving: number;

    @IsInt({ message: "숫자여야 합니다." })
    @Min(0, { message: "최소값은 0을 입력해야 합니다." })
    @Max(1, { message: "최댓값은 1을 입력해야 합니다." })
    @IsNotEmpty()
    @IsNumber()
    @Column()
    @ApiProperty({
        description: "으악새",
        example: "0",
    })
    yakbird: number;

    @IsInt({ message: "숫자여야 합니다." })
    @Min(0, { message: "최소값은 0을 입력해야 합니다." })
    @Max(1, { message: "최댓값은 1을 입력해야 합니다." })
    @IsNotEmpty()
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
    @IsNotEmpty()
    @IsNumber()
    @Column()
    @ApiProperty({
        description: "도망감",
        example: "1",
    })
    run: number;

    @IsInt({ message: "숫자여야 합니다." })
    @Min(0, { message: "최소값은 0을 입력해야 합니다." })
    @Max(1, { message: "최댓값은 1을 입력해야 합니다." })
    @IsNotEmpty()
    @IsNumber()
    @Column()
    @ApiProperty({
        description: "도둑",
        example: "0",
    })
    thief: number;

    @IsInt({ message: "숫자여야 합니다." })
    @Min(0, { message: "최소값은 0을 입력해야 합니다." })
    @Max(1, { message: "최댓값은 1을 입력해야 합니다." })
    @IsNotEmpty()
    @IsNumber()
    @Column()
    @ApiProperty({
        description: "예민함",
        example: "0",
    })
    mean: number;

    @IsInt({ message: "숫자여야 합니다." })
    @Min(0, { message: "최소값은 0을 입력해야 합니다." })
    @Max(1, { message: "최댓값은 1을 입력해야 합니다." })
    @IsNotEmpty()
    @IsNumber()
    @Column()
    @ApiProperty({
        description: "파출리아",
        example: "1",
    })
    zaza: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToOne(
        () => UserProfile,
        (userProfile) => userProfile.personaltagcounter,
    )
    @JoinColumn()
    userProfile: UserProfile;
}
