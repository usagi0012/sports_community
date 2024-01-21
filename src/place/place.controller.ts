import { Controller, Get, Post } from "@nestjs/common";
import { PlaceService } from "./place.service";
import { url } from "inspector";
import axios from "axios";

@Controller("place")
export class PlaceController {
    constructor(private readonly placeService: PlaceService) {}

    @Get()
    async getData() {
        const places = await this.placeService.crawlSpaces(
            "https://shareit-resource.shareit.kr/spaces?keyword&realTime=true&approve=true&region=-1&eventTypes=31&spaceThemeSeq&minPrice=0&maxPrice=-1&minPeople=0&minArea&maxArea&discount=0&sort=popularity&work=false&life=true&type=search",
        );
        return await this.placeService.saveSpaces(places);
    }
}
