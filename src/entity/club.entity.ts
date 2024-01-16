import { Region } from "src/enumtypes/clubregion.type";
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

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

    @Column()
    master: string;

    @Column()
    score?: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
