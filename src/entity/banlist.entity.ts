import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    JoinColumn,
} from "typeorm";
import { User } from "./user.entity";
import { IsNotEmpty, IsOptional } from "class-validator";
import { IsFutureDate } from "./../validate/future-validators";
export enum ActionType {
    WARNING = "warning",
    PENALTY = "penalty",
    PERMANENT_BAN = "permanentBan",
}

@Entity({
    name: "banlist",
})
export class Banlist {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    banListUserId: number;

    @ManyToOne(() => User, (user) => user.banList, { onDelete: "CASCADE" })
    @JoinColumn({ name: "banListUserId" })
    banListUser: User;

    @IsNotEmpty()
    @Column({
        type: "enum",
        enum: ActionType,
    })
    actionType: ActionType;

    @Column({ nullable: true, type: "datetime" })
    @IsOptional()
    @IsFutureDate()
    duration?: Date;

    static setDurationFromNumber(numberValue: number): Date {
        const currentDate = new Date();
        const futureDate = new Date(
            currentDate.getTime() + numberValue * 24 * 60 * 60 * 1000,
        );

        return new Date(futureDate.toDateString());
    }
}
