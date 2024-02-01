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
    @Get("me/:matchId")
    async findMyMatch(
        @Param("matchId") matchId: number,
        @UserId() userId: number,
    ) {
        return await this.matchService.findMyMatch(matchId, userId);
    }

    //매치 신청하기
    @Post("post/:recruitId")
    async postMatch(
        @Param("recruitId") recruitId: number,
        @UserId() userId: number,
        @Body() matchDTO: MatchDTO,
    ) {
        return await this.matchService.postMatch(recruitId, userId, matchDTO);
    }

    //매치 컴펌하기
    @Put("my/:matchId/confirm")
    async confirmMatch(
        @Param("matchId") matchId: number,
        @UserId() userId: number,
    ) {
        return await this.matchService.confirmMatch(matchId, userId);
    }

    // 신청 취소하기

    @Put("my/:matchId/cancel")
    async cancelMatch(
        @Param("matchId") matchId: number,
        @UserId() userId: number,
    ) {
        await this.matchService.cancelMatch(matchId, userId);
    }

    //본인 매치에서 경기한 유저아이디 조회
    @Get("my/:matchId/user")
    async findGameUser(
        @UserId() userId: number,
        @Param("matchId") matchId: number,
    ) {
        return await this.matchService.findGameUser(userId, matchId);
    }

    //경기 평가완료로 변경
    @Put("my/:matchId/evaluate")
    async doneGame(
        @UserId() userId: number,
        @Param("matchId") matchId: number,
    ) {
        return await this.matchService.doneGame(userId, matchId);
    }
    //취소 후 삭제
    @Delete("my/:matchId/cancel/delete")
    async deleteCancelGame(
        @UserId() userId: number,
        @Param("matchId") matchId: number,
    ) {
        return await this.matchService.deleteCancelGame(userId, matchId);
    }
    //평가 후 삭제
    // @Delete("my/:matchId/evaluate/delete")
    // async deleteGame(
    //     @UserId() userId: number,
    //     @Param("matchId") matchId: number,
    // ) {
    //     return await this.matchService.deleteGame(userId, matchId);
    // }
}
