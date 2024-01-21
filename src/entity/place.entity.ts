import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: "places",
})
export class Place {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    address: string;

    @Column()
    image: string;

    @Column()
    latitude: number;

    @Column()
    longitude: number;
}
