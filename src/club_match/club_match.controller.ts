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
import { accessTokenGuard } from "../auth/guard/access-token.guard";
import { UserId } from "../auth/decorators/userId.decorator";
import { ApiBearerAuth } from "@nestjs/swagger";
import { ClubMatchService } from "./club_match.service";
import { CheckClubMatchDTO, ClubMatchDTO } from "./dto/club_match.dto";
@Controller("clubmatch")
@ApiBearerAuth("accessToken")
@UseGuards(accessTokenGuard)
export class ClubMatchController {
    constructor(private readonly matchService: ClubMatchService) {}
    //매치 신청하기
    @Post(":clubid")
    async postClubMatch(
        @Param("clubid") id: number,
        @Body() clubMatchDTO: ClubMatchDTO,
        @UserId() userId: number,
    ) {
        return await this.matchService.postClubMatch(id, userId, clubMatchDTO);
    }
    //host매치 조회하기
    @Get("host")
    async getHostMatch(@UserId() userId: number) {
        return await this.matchService.getHostMatch(userId);
    }
    //호스트 매치 상세조회
    @Get("host/:clubmatchid")
    async findHostMatch(
        @Param("clubmatchid") id: number,
        @UserId() userId: number,
    ) {
        return await this.matchService.findHostMatch(id, userId);
    }
    //host매치 승인/거절하기
    @Put("host/:clubmatchid")
    async putHostMatch(
        @Param("clubmatchid") id: number,
        @UserId() userId: number,
        @Body() checkClubMatchDTO: CheckClubMatchDTO,
    ) {
        return await this.matchService.putHostMatch(
            id,
            userId,
            checkClubMatchDTO,
        );
    }
    //guest매치 조회하기
    @Get("guest")
    async getGuestMatch(@Param("clubid") id: number, @UserId() userId: number) {
        return await this.matchService.getGuestMatch(userId);
    }
    //guest매치 상세조회
    @Get("guest/:clubmatchid")
    async findGuestMatch(
        @Param("clubmatchid") id: number,
        @UserId() userId: number,
    ) {
        return await this.matchService.findGuestMatch(id, userId);
    }
    //게스트 매치 취소하기
    @Put("guest/:clubmatchid")
    async cancelGuestMatch(
        @Param("clubmatchid") id: number,
        @UserId() userId: number,
        @Body() checkClubMatchDTO: CheckClubMatchDTO,
    ) {
        return await this.matchService.cancelGuestMatch(
            id,
            userId,
            checkClubMatchDTO,
        );
    }
    //삭제하기
    @Delete("delete/:clubmatchid")
    async deleteClubMatch(
        @Param("clubmatchid") id: number,
        @UserId() userId: number,
    ) {
        return await this.matchService.deleteClubMatch(id, userId);
    }
}
