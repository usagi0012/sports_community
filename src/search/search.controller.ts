// search.controller.ts
import { Controller, Get, Query } from "@nestjs/common";
import { SearchService } from "./search.service";

@Controller("search")
export class SearchController {
    constructor(private readonly searchService: SearchService) {}

    @Get("/club")
    async searchClub(@Query("query") query: string) {
        const club = await this.searchService.searchClub(query);
        return { club };
    }

    @Get("/recruitment")
    async searchRecruit(@Query("query") query: string) {
        const recruit = await this.searchService.searchRecruit(query);
        return { recruit };
    }

    @Get("/place")
    async searchPlace(@Query("query") query: string) {
        const place = await this.searchService.searchPlace(query);
        return { place };
    }
}
