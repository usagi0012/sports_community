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
                    .get(`${url}&size=5&page=${page}`, {
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
        })
        const existPlacesName = existPlaces.map(e =>{
            return e.name;
        })
        console.log(existPlacesName)
        for(let i=0; i<=places.length; i++){
            for(let j=0; j<5; j++){
                console.log(places[i][j])
                // if(existPlacesName.filter(e=>{
                //     return e!==places[i][j].name
                // }).length <1 ){
                //     console.log(places[i][j])
                //     // await this.placeRepository.save({
                //     //     name: places[i][j].name,
                //     //     address: places[i][j].address,
                //     //     image: places[i][j].image,
                //     //     latitude: places[i][j].latitude,
                //     //     longitude: places[i][j].longitude,
                //     // })
                // }
            }
        }
        return existPlacesName;
        console.log(existPlacesName);
        // await places.forEach((e) => {
        //     e = e.filter((ele) => {
        //        return ele.name !== existPlaces.name 
        //         console.log(ele.name)
        //         if( arr.filter((e) => { return e.id == user.id }).length < 1 ) arr.push(user);
        //         if(ele.name)
        //     });
        // });
    }
}
