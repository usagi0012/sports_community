import { Region } from "src/enumtypes/clubregion.type";
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    OneToMany,
    JoinTable,
    Relation,
} from "typeorm";
import { User } from "./user.entity";
import { toUSVString } from "util";
import { ClubMatch } from "./club_match.entity";
import { ClubApplication } from "./club-application.entity";

@Entity({
    name: "clubs", // 데이터베이스 테이블의 이름
})
export class Club {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column()
    region: Region;

    @Column()
    members: number;

    @Column()
    description: string;

    @Column({ nullable: true })
    image: string;

    @Column()
    masterId: number;

    @Column()
    score?: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => User, (user) => user.club, { cascade: true })
    users: User[];
    @OneToMany(
        () => ClubApplication,
        (clubApplication) => clubApplication.club,
        { cascade: true },
    )
    clubApplications: ClubApplication[];

    @OneToMany(() => ClubMatch, (match) => match.hostClub)
    hostedMatches: ClubMatch[];

    @OneToMany(() => ClubMatch, (match) => match.guestClub)
    guestMatches: ClubMatch[];
}
