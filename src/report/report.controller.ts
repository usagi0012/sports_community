import { ReportProcessDTO } from "./dto/process.report.dto";
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { accessTokenGuard } from "../auth/guard/access-token.guard";
import { ReportService } from "./report.service";
import { UserId } from "../auth/decorators/userId.decorator";
import { userInfo } from "os";
import { ReportDTO } from "./dto/report.dto";
import { BanGuard } from "../auth/guard/ban.guard";
import { BanUsers } from "./../auth/decorators/banUser.decorator";
import { UserType } from "src/entity/user.entity";

@ApiTags("신고 시스템")
@Controller("report")
@ApiBearerAuth("accessToken")
@UseGuards(accessTokenGuard)
export class ReportController {
    constructor(private readonly reportService: ReportService) {}

    //벤 유저 조회하기
    @Get(":banUserId")
    async getBanUser(
        @UserId() userId: number,
        @Param("banUserId") banUserId: number,
    ) {
        return await this.reportService.getBanUser(userId, banUserId);
    }
    //벤 신청하기
    @Post(":banUserId")
    async banUser(
        @UserId() userId: number,
        @Param("banUserId") banUserId: number,
        @Body() reportDTO: ReportDTO,
    ) {
        return await this.reportService.banUser(userId, banUserId, reportDTO);
    }
    //본인이 신청한 벤 조회하기
    @Get("banlist/me")
    async getMyBan(@UserId() userId: number) {
        return await this.reportService.getMyBan(userId);
    }
    //마이벤 상세조회
    @Get("me/:reportId")
    async findMyBan(
        @UserId() userId: number,
        @Param("reportId") reportId: number,
    ) {
        return await this.reportService.findMyBan(userId, reportId);
    }

    //APPROVE/CANCEL된 리포트 컴펌하여 삭제하기
    @Put("me/:reportId")
    async confirmBan(
        @UserId() userId: number,
        @Param("reportId") reportId: number,
    ) {
        console.log(userId);
        console.log(reportId);
        return await this.reportService.confirmBan(userId, reportId);
    }

    //그냥 취소하고 삭제하기
    @Delete("me/cancel/:reportId")
    async deleteBan(
        @UserId() userId: number,
        @Param(":reportId") reportId: number,
    ) {
        return await this.reportService.deleteBan(userId, reportId);
    }
    //어드민 벤 명단보기
    @Get("admin/banlist")
    async getBan(@UserId() userId: number) {
        return await this.reportService.getBan(userId);
    }
    //어드민 벤 상세 명단보기
    @Get("admin/find/:reportId")
    async findBan(
        @UserId() userId: number,
        @Param("reportId") reportId: number,
    ) {
        console.log(userId);
        console.log(reportId);
        return await this.reportService.findBan(userId, reportId);
    }
    //어드민 벤 승인 거절
    @Put("admin/process/:reportId")
    async processBan(
        @UserId() userId: number,
        @Param("reportId") reportId: number,
        @Body() reportProcessDTO: ReportProcessDTO,
    ) {
        console.log(userId);
        console.log(reportId);
        console.log(reportProcessDTO);
        return await this.reportService.processBan(
            userId,
            reportId,
            reportProcessDTO,
        );
    }
}
