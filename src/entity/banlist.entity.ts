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
import moment from "moment-timezone";

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
        const now = moment();
        const korNow = now.tz("Asia/Seoul");

        console.log(korNow.format());

        const futureDate = korNow.clone().add(numberValue, "days");

        console.log(futureDate.format());
        return futureDate.toDate();
    }
}
