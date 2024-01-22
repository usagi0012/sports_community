import { Match } from "./../entity/match.entity";
import {
    Controller,
    Body,
    Param,
    Get,
    Post,
    UseGuards,
    Delete,
    Put,
} from "@nestjs/common";

import { MatchService } from "./match.service";
import { MatchDTO } from "./dto/match.dto";
import { accessTokenGuard } from "../auth/guard/access-token.guard";
import { UserId } from "../auth/decorators/userId.decorator";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags("개인 매치 신청")
@Controller("match")
@ApiBearerAuth("accessToken")
@UseGuards(accessTokenGuard)
export class MatchController {
    constructor(private readonly matchService: MatchService) {}

    //나의 매치 조회
    @Get("me")
    async getMyMatch(@UserId() userId: number) {
        const matches = await this.matchService.getMyMatch(userId);

        for (const match of matches) {
            await match.updateProgress();
        }

        return matches;
    }

    //나의매치 상세조회
    @Get("me/:matchid")
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

    //매치 컴펌하기
    @Put("my/:matchid/confirm")
    async confirmMatch(@Param("matchid") id: number, @UserId() userId: number) {
        return await this.matchService.confirmMatch(id, userId);
    }

    // 신청 취소하기

    @Put("my/:matchid/cancel")
    async cancelMatch(@Param("matchid") id: number, @UserId() userId: number) {
        await this.matchService.cancelMatch(id, userId);
    }

    //본인 매치에서 경기한 유저아이디 조회
    @Get("my/:matchid/user")
    async findGameUser(@UserId() userId: number, @Param("matchid") id: number) {
        return await this.matchService.findGameUser(userId, id);
    }

    //경기 평가완료로 변경
    @Put("my/:matchid/evaluate")
    async doneGame(@UserId() userId: number, @Param("matchid") id: number) {
        return await this.matchService.doneGame(userId, id);
    }

    //평가 후 삭제
    @Delete("my/:matchid")
    async deleteGame(@UserId() userId: number, @Param("matchid") id: number) {
        return await this.matchService.deleteGame(userId, id);
    }
}
