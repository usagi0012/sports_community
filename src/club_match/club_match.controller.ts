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
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ClubMatchService } from "./club_match.service";
import {
    CheckClubMatchDTO,
    ClubMatchDTO,
    ChangeTimeDTO,
} from "./dto/club_match.dto";

@ApiTags("동아리 대결 신청")
@Controller("clubmatch")
@ApiBearerAuth("accessToken")
@UseGuards(accessTokenGuard)
export class ClubMatchController {
    constructor(private readonly clubMatchService: ClubMatchService) {}
    //매치 신청하기
    @Post(":clubid")
    async postClubMatch(
        @Param("clubid") id: number,
        @Body() clubMatchDTO: ClubMatchDTO,
        @UserId() userId: number,
    ) {
        return await this.clubMatchService.postClubMatch(
            id,
            userId,
            clubMatchDTO,
        );
    }
    //host매치 조회하기
    @Get("host")
    async getHostMatch(@UserId() userId: number) {
        return await this.clubMatchService.getHostMatch(userId);
    }
    //호스트 매치 상세조회
    @Get("host/:clubmatchid")
    async findHostMatch(
        @Param("clubmatchid") id: number,
        @UserId() userId: number,
    ) {
        return await this.clubMatchService.findHostMatch(id, userId);
    }
    //host매치 승인/거절하기
    @Put("host/:clubmatchid")
    async putHostMatch(
        @Param("clubmatchid") id: number,
        @UserId() userId: number,
        @Body() checkClubMatchDTO: CheckClubMatchDTO,
    ) {
        return await this.clubMatchService.putHostMatch(
            id,
            userId,
            checkClubMatchDTO,
        );
    }
    //host 경기 시간 변경하기
    @Put("host/time/:clubmatchid")
    async changeTime(
        @Param("clubmatchid") id: number,
        @UserId() userId: number,
        @Body() changeTimeDTO: ChangeTimeDTO,
    ) {
        console.log(id);
        console.log(userId);
        console.log(changeTimeDTO);
        return await this.clubMatchService.changeTime(
            id,
            userId,
            changeTimeDTO,
        );
    }

    //host 경기 평가 완료하기
    @Put("host/evaluate/:clubmatchid")
    async evaluateHost(
        @Param("clubmatchid") id: number,
        @UserId() userId: number,
    ) {
        return await this.clubMatchService.evaluateHost(id, userId);
    }

    //guest매치 조회하기
    @Get("guest")
    async getGuestMatch(@UserId() userId: number) {
        return await this.clubMatchService.getGuestMatch(userId);
    }
    //guest매치 상세조회
    @Get("guest/:clubmatchid")
    async findGuestMatch(
        @Param("clubmatchid") id: number,
        @UserId() userId: number,
    ) {
        return await this.clubMatchService.findGuestMatch(id, userId);
    }
    //게스트 매치 취소하기
    @Put("guest/cancel/:clubmatchid")
    async cancelGuestMatch(
        @Param("clubmatchid") id: number,
        @UserId() userId: number,
        @Body() checkClubMatchDTO: CheckClubMatchDTO,
    ) {
        return await this.clubMatchService.cancelGuestMatch(
            id,
            userId,
            checkClubMatchDTO,
        );
    }

    //guest 경기 평가 완료하기
    @Put("host/evaluate/:clubmatchid")
    async evaluateGuest(
        @Param("clubmatchid") id: number,
        @UserId() userId: number,
    ) {
        return await this.clubMatchService.evaluateGuest(id, userId);
    }

    //취소된 경기 삭제하기
    @Delete("delete/:clubmatchid")
    async deleteClubMatch(
        @Param("clubmatchid") id: number,
        @UserId() userId: number,
    ) {
        return await this.clubMatchService.deleteClubMatch(id, userId);
    }

    //평가 완료된 경기 삭제하기
    @Delete("delete/comfirm/:clubmatchid")
    async confirmClubMatch(
        @Param("clubmatchid") id: number,
        @UserId() userId: number,
    ) {
        return await this.clubMatchService.confirmClubMatch(id, userId);
    }
}
