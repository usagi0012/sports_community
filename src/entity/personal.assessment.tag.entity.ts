import { IsBoolean } from "class-validator";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Userscore } from "./personal.assessment.entity";

@Entity({ name: "personal_tag" })
export class Personaltag {
    @PrimaryGeneratedColumn({ unsigned: true })
    id: number;

    @IsBoolean()
    @Column({ default: false })
    jorden: boolean;

    @IsBoolean()
    @Column({ default: false })
    daeman: boolean;

    @IsBoolean()
    @Column({ default: false })
    teawoong: boolean;

    @IsBoolean()
    @Column({ default: false })
    chisu: boolean;

    @IsBoolean()
    @Column({ default: false })
    curry: boolean;

    @IsBoolean()
    @Column({ default: false })
    irving: boolean;

    @IsBoolean()
    @Column({ default: false })
    yakbird: boolean;

    @IsBoolean()
    @Column({ default: false })
    late: boolean;

    @IsBoolean()
    @Column({ default: false })
    run: boolean;

    @IsBoolean()
    @Column({ default: false })
    thief: boolean;

    @IsBoolean()
    @Column({ default: false })
    mean: boolean;

    @IsBoolean()
    @Column({ default: false })
    zaza: boolean;

    @ManyToOne(() => Userscore, (userscroe) => userscroe.tag)
    userscore: Userscore;
}
