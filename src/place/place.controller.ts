import { Controller, Get, Post } from "@nestjs/common";
import { PlaceService } from "./place.service";
import { url } from "inspector";
import axios from "axios";

@Controller("place")
export class PlaceController {
    constructor(private readonly placeService: PlaceService) {}

    // @Get()
    // getdata() {
    //     return this.placeService.getHtml(
    //         "https://shareit.kr/search/venue?showEventTypeHeader=true&eventTypes=31",
    //     );
    // }
    // @Get()
    // async crawl(): Promise<string[]> {
    //     const url =
    //         "https://shareit.kr/search/venue?keyword=&realTime=true&approve=true&region=-1&areas=&eventTypes=31&spaceTypes=&equipments=&minPrice=0&maxPrice=-1&minPeople=0&discount=0&page=1&sort=popularity";
    //     const content = await this.placeService.crawlWebsite(url);
    //     const extractedTexts =
    //         await this.placeService.extractTextFromTag(content);

    //     return extractedTexts;
    // }

    @Get()
    getData() {
        try {
            return this.placeService.crawlSpaces(
                "https://shareit-resource.shareit.kr/spaces?keyword&realTime=true&approve=true&region=-1&eventTypes=31&spaceThemeSeq&minPrice=0&maxPrice=-1&minPeople=0&minArea&maxArea&discount=0&page=1&sort=popularity&work=false&life=true&size=30&type=search",
            );
        } catch (error) {
            return { error: error.message };
        }
    }
}
