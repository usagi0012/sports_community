import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Club } from "src/entity/club.entity";
import { UserService } from "src/user/user.service";
import { Repository } from "typeorm";
import { CreateClubDto } from "./dto/createClub.dto";

@Injectable()
export class ClubService {
    constructor(
        @InjectRepository(Club)
        private readonly clubRepository: Repository<Club>,
        private readonly userService: UserService,
    ) {}

    async getAllClubs() {
        const clubs = await this.clubRepository.find({
            select: ["id", "name", "region", "masterId", "score"],
        });
        return clubs;
    }

    async getClub(id: number) {
        const club = await this.clubRepository.findOne({
            where: { id },
            relations: { users: true },
            select: [],
        });

        return club;
    }

    async createClub(createClubDto: CreateClubDto, userId: number) {
        const user = await this.userService.findUserById(userId);

        const { name, region, description } = createClubDto;
        // await this.userRepository.
        const club = await this.clubRepository.save({
            name,
            region,
            description,
            users: [user],
            masterId: user.id,
        });

        return club;
    }
}
