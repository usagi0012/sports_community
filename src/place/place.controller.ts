import { Controller, Get, Post, Query } from "@nestjs/common";
import { PlaceService } from "./place.service";
import { Cron } from "@nestjs/schedule";
import { url } from "inspector";
import axios from "axios";

@Controller("place")
export class PlaceController {
    constructor(private readonly placeService: PlaceService) {}

    @Cron("0 3 1 * *")
    async getData() {
        console.log("hi");
        const places = await this.placeService.crawlSpaces(
            "https://shareit-resource.shareit.kr/spaces?keyword&realTime=true&approve=true&region=-1&eventTypes=31&spaceThemeSeq&minPrice=0&maxPrice=-1&minPeople=0&minArea&maxArea&discount=0&sort=popularity&work=false&life=true&type=search",
        );
    }

    @Get()
    async showData(@Query("page") page: number, @Query("size") size: number) {
        return await this.placeService.showSpaces(+page, +size);
    }
}
