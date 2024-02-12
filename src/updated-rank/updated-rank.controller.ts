import { Controller, Get, Post, Put } from "@nestjs/common";
import { UpdatedRankService } from "./updated-rank.service";
import { ApiBearerAuth } from "@nestjs/swagger";

@Controller("updated-rank")
export class UpdatedRankController {
    constructor(private readonly updatedRankService: UpdatedRankService) {}

    // 개인 랭킹 업데이트
    @Put("personal")
    async savePersonalRank() {
        return await this.updatedRankService.savePersonalRank();
    }

    // 클럽 랭킹 업데이트
    @Put("club")
    async saveClubRank() {
        return await this.updatedRankService.saveClubRank();
    }

    @Get("personal")
    async getPersonalRank() {
        return await this.updatedRankService.getPersonalRank();
    }

    @Get("club")
    async getClubRank() {
        return await this.updatedRankService.getClubRank();
    }
}
