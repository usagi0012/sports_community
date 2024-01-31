import { Recruit } from "./../entity/recruit.entity";
import {
    Controller,
    Body,
    Param,
    Get,
    Put,
    Post,
    UseGuards,
    Delete,
} from "@nestjs/common";

import { RecruitDTO, UpdateDto, PutDTO } from "./dto/recruit.dto";
import { MatchUpdateDto } from "./dto/checkmatch.dto";
import { RecruitService } from "./recruit.service";
import { User } from "../entity/user.entity";
import { accessTokenGuard } from "../auth/guard/access-token.guard";
import { UserId } from "../auth/decorators/userId.decorator";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags("매치 모집 글")
@Controller("recruit")
@ApiBearerAuth("accessToken")
@UseGuards(accessTokenGuard)
export class RecruitController {
    constructor(private readonly recruitService: RecruitService) {}

    //모집 글 등록
    @Post("")
    async postRecruit(
        @UserId() userId: number,
        @Body() recruitDTO: RecruitDTO,
    ) {
        return await this.recruitService.postRecruit(userId, recruitDTO);
    }
    //모집 글 조회
    @Get("")
    async getRecruit() {
        return await this.recruitService.getRecruit();
    }
    //모집 글 상세조회
    @Get(":recruitId")
    async findRecruit(@Param("recruitId") recruitId: number) {
        return await this.recruitService.findRecruit(recruitId);
    }

    // 내 모집글
    @Get("my/post")
    async myRecruit(@UserId() userId: number) {
        const recruits = await this.recruitService.myRecruit(userId);

        return recruits;
    }

    // 내 모집글 상세 조회
    @Get("my/post/:recruitId")
    async findMyRecruit(
        @UserId() userId: number,
        @Param("recruitId") recruitId: number,
    ) {
        return await this.recruitService.findMyRecruit(userId, recruitId);
    }

    // 모집글 매치 상세조회
    @Get("my/post/match/:matchId")
    async checkMatch(
        @UserId() userId: number,
        @Param("matchId") matchId: number,
    ) {
        return await this.recruitService.checkMatch(userId, matchId);
    }

    // 모집글 승인/거절
    @Put("my/post/match/:matchId")
    async putMatch(
        @UserId() userId: number,
        @Param("matchId") matchId: number,
        @Body() matchUpdateDto: MatchUpdateDto,
    ) {
        return await this.recruitService.putMatch(
            userId,
            matchUpdateDto,
            matchId,
        );
    }

    //본인 모집글 참석 컴펌한 유저 조회
    @Get("my/post/:recruitId/user")
    async getGameUser(
        @UserId() userId: number,
        @Param("recruitId") recruitId: number,
    ) {
        return await this.recruitService.getGameUser(userId, recruitId);
    }

    //평가완료하기
    @Put("my/post/:recurtId/evaluate")
    async evaluateGame(
        @UserId() userId: number,
        @Param("recurtId") recruitId: number,
    ) {
        return await this.recruitService.evaluateGame(userId, recruitId);
    }

    //모집 글 삭제
    @Delete("my/post/:recurtId")
    async deleteRecruit(
        @UserId() userId: number,
        @Param("recurtId") recruitId: number,
    ) {
        const hostId = userId;
        await this.recruitService.deleteRecruit(hostId, recruitId);

        return {
            message: "해당 모집글이 삭제되었습니다.",
        };
    }

    //모집 글 수정
    @Put("my/post/match/edit/:recruitId")
    async editMatch(
        @UserId() userId: number,
        @Param("recruitId") recruitId: number,
        @Body() putDTO: PutDTO,
    ) {
        return await this.recruitService.editMatch(userId, putDTO, recruitId);
    }
}
