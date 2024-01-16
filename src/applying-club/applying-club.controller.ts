import { Controller } from "@nestjs/common";
import { ApplyingClubService } from "./applying-club.service";

@Controller("applying-club")
export class ApplyingClubController {
    constructor(private readonly applyingClubService: ApplyingClubService) {}

    async postApplyingClub() {
        const postedApplying =
            await this.applyingClubService.postApplyingClub();
    }
}
