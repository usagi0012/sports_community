import { ConsoleLogger, Injectable } from "@nestjs/common";
import * as cheerio from "cheerio";
import axios from "axios";
import { ContentType } from "aws-sdk/clients/cloudsearchdomain";
import { Place } from "../entity/place.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class PlaceService {
    constructor(
        @InjectRepository(Place)
        private readonly placeRepository: Repository<Place>,
    ) {}

    //장소 크롤링해서 디비에 저장
    async crawlSpaces(url: string) {
        try {
            let places = new Array(10);
            for (let page = 1; page < 11; page++) {
                const response = await axios
                    .get(`${url}&size=20&page=${page}`, {
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
                                latitude: t.latitude,
                                longitude: t.longitude,
                            };
                        });
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
            return places;
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
                        latitude: places[i][j].latitude,
                        longitude: places[i][j].longitude,
                    });
                }
            }
        }

        const newexistPlaces = await this.placeRepository.find({
            select: ["id", "name", "address", "image"],
        });

        return newexistPlaces;
    }
}
