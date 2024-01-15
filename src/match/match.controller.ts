import {
    Controller,
    Body,
    Param,
    Get,
    Post,
    UseGuards,
    Delete,
} from "@nestjs/common";

import { User } from "../entity/user.entity";
import { MatchService } from "./match.service";
import { MatchDTO } from "./dto/match.dto";
import { accessTokenGuard } from "src/auth/guard/access-token.guard";
import { UserId } from "src/auth/decorators/userId.decorator";
import { ApiBearerAuth } from "@nestjs/swagger";

@Controller("recruit")
@ApiBearerAuth("accessToken")
@UseGuards(accessTokenGuard)
export class MatchController {
    constructor(private readonly matchService: MatchService) {}

    //나의 매치 조회
    @Get("mymatch")
    async getMyMatch(@UserId() userId: number) {
        await this.matchService.getMyMatch(userId);
    }
    //나의매치 상세조회
    @Get("mymatch/:matchid")
    async findMyMatch(@Param("matchid") id: number, @UserId() userId: number) {
        await this.matchService.findMyMatch(id, userId);
    }

    //매치 신청하기
    @Post(":id/match")
    async postMatch(
        @Param("id") id: number,
        @UserId() userId: number,
        @Body() matchDTO: MatchDTO,
    ) {
        await this.matchService.postMatch(id, userId, matchDTO);
    }

    // 신청 취소하기

    @Delete("mymatch/:matchid")
    async deleteMatch(@Param("matchid") id: number, @UserId() userId: number) {
        await this.matchService.deleteMatch(id, userId);
    }
}
