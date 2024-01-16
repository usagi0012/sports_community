import { IsBoolean } from "class-validator";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Clubscore } from "./club.assessment.entity";

@Entity({ name: "club_tag" })
export class Clubtag {
    @PrimaryGeneratedColumn({ unsigned: true })
    id: number;

    @IsBoolean()
    @Column({ default: false })
    buksan: boolean;

    @IsBoolean()
    @Column({ default: false })
    sanantonio: boolean;

    @IsBoolean()
    @Column({ default: false })
    gentle: boolean;

    @IsBoolean()
    @Column({ default: false })
    manner: boolean;

    @IsBoolean()
    @Column({ default: false })
    lakers: boolean;

    @IsBoolean()
    @Column({ default: false })
    oneman: boolean;

    @IsBoolean()
    @Column({ default: false })
    goldenstate: boolean;

    @IsBoolean()
    @Column({ default: false })
    notbed: boolean;

    @IsBoolean()
    @Column({ default: false })
    bed: boolean;

    @IsBoolean()
    @Column({ default: false })
    tough: boolean;

    @IsBoolean()
    @Column({ default: false })
    fighter: boolean;

    @IsBoolean()
    @Column({ default: false })
    late: boolean;

    @IsBoolean()
    @Column({ default: false })
    zaza: boolean;

    @ManyToOne(() => Clubscore, (clubscroe) => clubscroe.tag)
    clubscore: Clubscore;
}
