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
    @Get(":id")
    async findRecruit(@Param("id") id: number) {
        return await this.recruitService.findRecruit(id);
    }

    //모집 글 수정
    // @Put(":id")
    // async putRecruit(
    //     @UserId() userId: number,
    //     @Body() putDTO: PutDTO,
    //     @Param("id") id: number,
    // ) {
    //     const hostId = userId;

    //     return await this.recruitService.putRecruit(hostId, putDTO, id);
    // }

    //모집 글 status 수정
    // @Put("status/:id")
    // async updateRecruit(
    //     @UserId() userId: number,
    //     @Body() updateDto: UpdateDto,
    //     @Param("id") id: number,
    // ) {
    //     const hostId = userId;
    //     return await this.recruitService.updateRecruit(hostId, updateDto, id);
    // }

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
        @Param("recruitId") id: number,
    ) {
        return await this.recruitService.findMyRecruit(userId, id);
    }

    // 모집글 매치 상세조회
    @Get("my/post/match/:matchid")
    async checkMatch(@UserId() userId: number, @Param("matchid") id: number) {
        return await this.recruitService.checkMatch(userId, id);
    }

    // 모집글 승인/거절
    @Put("my/post/match/:matchid")
    async putMatch(
        @UserId() userId: number,
        @Param("matchid") id: number,
        @Body() matchUpdateDto: MatchUpdateDto,
    ) {
        return await this.recruitService.putMatch(userId, matchUpdateDto, id);
    }

    //본인 모집글 참석 컴펌한 유저 조회
    @Get("my/post/:recruitId/user")
    async getGameUser(
        @UserId() userId: number,
        @Param("recruitId") id: number,
    ) {
        return await this.recruitService.getGameUser(userId, id);
    }

    //평가완료하기
    @Put("my/post/:recurtId/evaluate")
    async evaluateGame(
        @UserId() userId: number,
        @Param("recurtId") id: number,
    ) {
        return await this.recruitService.evaluateGame(userId, id);
    }

    //모집 글 삭제
    @Delete("my/post/:recurtId")
    async deleteRecruit(
        @UserId() userId: number,
        @Param("recurtId") id: number,
    ) {
        const hostId = userId;
        return await this.recruitService.deleteRecruit(hostId, id);
    }
}
