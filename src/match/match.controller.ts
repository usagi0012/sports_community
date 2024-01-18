import {
    Controller,
    Body,
    Param,
    Get,
    Post,
    UseGuards,
    Delete,
} from "@nestjs/common";

import { MatchService } from "./match.service";
import { MatchDTO } from "./dto/match.dto";
import { accessTokenGuard } from "../auth/guard/access-token.guard";
import { UserId } from "../auth/decorators/userId.decorator";
import { ApiBearerAuth } from "@nestjs/swagger";

@Controller("match")
@ApiBearerAuth("accessToken")
@UseGuards(accessTokenGuard)
export class MatchController {
    constructor(private readonly matchService: MatchService) {}

    //나의 매치 조회
    @Get("my")
    async getMyMatch(@UserId() userId: number) {
        return await this.matchService.getMyMatch(userId);
    }
    //나의매치 상세조회
    @Get("my/:matchid")
    async findMyMatch(@Param("matchid") id: number, @UserId() userId: number) {
        return await this.matchService.findMyMatch(id, userId);
    }

    //매치 신청하기
    @Post("post/:recruitid")
    async postMatch(
        @Param("recruitid") id: number,
        @UserId() userId: number,
        @Body() matchDTO: MatchDTO,
    ) {
        return await this.matchService.postMatch(id, userId, matchDTO);
    }

    // 신청 취소하기

    @Delete("cancel/:matchid")
    async deleteMatch(@Param("matchid") id: number, @UserId() userId: number) {
        await this.matchService.deleteMatch(id, userId);
    }
}
