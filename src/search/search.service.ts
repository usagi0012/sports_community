import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Like } from "typeorm";
import { Recruit } from "../entity/recruit.entity";
import { Club } from "../entity/club.entity";
import { Place } from "../entity/place.entity";

@Injectable()
export class SearchService {
    constructor(
        @InjectRepository(Recruit)
        private readonly recruitRepository: Repository<Recruit>,
        @InjectRepository(Club)
        private readonly clubRepository: Repository<Club>,
        @InjectRepository(Place)
        private readonly placeRepository: Repository<Place>,
    ) {}
    async searchClub(query: string) {
        const clubs = await this.clubRepository.find({
            where: [
                { name: Like(`%${query}%`) },
                { description: Like(`%${query}%`) },
                // 다른 필드들에 대한 검색 조건 추가
            ],
        });

        return { clubs };
    }
    async searchRecruit(query: string) {
        const recruits = await this.recruitRepository.find({
            where: [
                { title: Like(`%${query}%`) },
                { content: Like(`%${query}%`) },
                // 다른 필드들에 대한 검색 조건 추가
            ],
        });

        return { recruits };
    }

    async searchPlace(query: string) {
        const places = await this.placeRepository.find({
            where: [
                { name: Like(`%${query}%`) },
                // 다른 필드들에 대한 검색 조건 추가
            ],
        });

        return { places };
    }
}
