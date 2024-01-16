import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Club } from "src/entity/club.entity";
import { UserService } from "src/user/user.service";
import { Repository } from "typeorm";

@Injectable()
export class ClubService {
    constructor(
        @InjectRepository(Club)
        private readonly clubRepository: Repository<Club>,
        private readonly userService: UserService,
    ) {}

    async getAllClubs() {
        const clubs = await this.clubRepository.find({
            select: ["id", "name", "region", "master", "score"],
        });
        return clubs;
    }
}
