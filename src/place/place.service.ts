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
                    .get(`${url}&size=2&page=${page}`, {
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
        const existPlaces = await this.placeRepository.find({
            select: ["name"],
        });
        console.log(existPlaces);
        await places.forEach((e) => {
            e.forEach((ele) => {});
        });
    }
}
