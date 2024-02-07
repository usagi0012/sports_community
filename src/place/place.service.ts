import { ConsoleLogger, Injectable } from "@nestjs/common";
import * as cheerio from "cheerio";
import axios from "axios";
import { Place } from "../entity/place.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Cron } from "@nestjs/schedule";

@Injectable()
export class PlaceService {
    constructor(
        @InjectRepository(Place)
        private readonly placeRepository: Repository<Place>,
    ) {}

    //장소 크롤링해서 디비에 저장
    async crawlSpaces(url: string) {
        try {
            let places = new Array(15);
            for (let page = 1; page < 16; page++) {
                const response = await axios
                    .get(`${url}&size=30&page=${page}`, {
                        headers: {
                            "Content-Type": "application/json;charset=UTF-8",
                        },
                    })
                    .then(function (response) {
                        const test = response.data.content.resources;
                        places[page - 1] = test.map((t) => {
                            return {
                                name: t.host.name,
                                address: t.address,
                                image: t.photos[0].file.resourcePath,
                                link: t.seq,
                            };
                        });
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
            return await this.saveSpaces(places);
        } catch (error) {
            throw new Error(`Error in crawlSpaces: ${error.message}`);
        }
    }

    async saveSpaces(places) {
        for (let i = 0; i < places.length; i++) {
            for (let j = 0; j < 20; j++) {
                const existPlaces = await this.placeRepository.find({
                    select: ["name"],
                });
                const existPlacesName = existPlaces.map((e) => {
                    return e.name;
                });
                if (
                    existPlacesName.filter((e) => {
                        return e == places[i][j].name;
                    }).length < 1
                ) {
                    await this.placeRepository.save({
                        name: places[i][j].name,
                        address: places[i][j].address,
                        image: places[i][j].image,
                        link: places[i][j].link,
                    });
                }
            }
        }
        const newexistPlaces = await this.placeRepository.find({
            select: ["id", "name", "address", "image", "link"],
        });

        return newexistPlaces;
    }

    //장소 불러오기
    async showSpaces(page: number, size: number) {
        if (!size) {
            size = 28;
        }
        const [place, total] = await this.placeRepository.findAndCount({
            select: ["id", "name", "address", "image", "link"],
            take: size,
            skip: (page - 1) * size,
        });

        return {
            data: place,
            meta: {
                total,
                page,
                lastPage: Math.ceil(total / size),
            },
        };
    }
}
