import { Controller, Get } from "@nestjs/common";
import { PlaceService } from "./place.service";
import { url } from "inspector";

@Controller("place")
export class PlaceController {
    constructor(private readonly placeService: PlaceService) {}

    // @Get()
    // getdata() {
    //     return this.placeService.getHtml(
    //         "https://shareit.kr/search/venue?showEventTypeHeader=true&eventTypes=31",
    //     );
    // }
}
