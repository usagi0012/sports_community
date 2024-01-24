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
import { BanGuard } from "./../auth/decorators/ban.guard";
import { BanUsers } from "./../auth/decorators/banUser.decorator";
import { UserType } from "src/entity/user.entity";

@ApiTags("신고 시스템")
@Controller("report")
@ApiBearerAuth("accessToken")
@UseGuards(accessTokenGuard, BanGuard)
@BanUsers(UserType.BANNED_USER, UserType.PERMANENT_BAN)
export class ReportController {
    constructor(private readonly reportService: ReportService) {}

    //벤 신청하기
    @Post(":banUserId")
    async benUser(
        @UserId() userId: number,
        @Param("banUserId") banUserId: number,
        @Body() reportDTO: ReportDTO,
    ) {
        return await this.reportService.benUser(userId, banUserId, reportDTO);
    }
    //본인이 신청한 벤 조회하기
    @Get("me")
    async getMyBen(@UserId() userId: number) {
        return await this.reportService.getMyBen(userId);
    }
    //마이벤 상세조회
    @Get("me/:reportId")
    async findMyBen(
        @UserId() userId: number,
        @Param("reportId") reportId: number,
    ) {
        return await this.reportService.findMyBen(userId, reportId);
    }

    //APPROVE/CANCEL된 리포트 컴펌하여 삭제하기
    @Delete("me/:reportId")
    async confirmBen(
        @UserId() userId: number,
        @Param("reportId") reportId: number,
    ) {
        return await this.reportService.confirmBen(userId, reportId);
    }

    //그냥 취소하고 삭제하기
    @Delete("me/cancel/:reportId")
    async deleteBen(
        @UserId() userId: number,
        @Param(":reportId") reportId: number,
    ) {
        return await this.reportService.deleteBen(userId, reportId);
    }
    //어드민 벤 명단보기
    @Get("admin")
    async getBen(@UserId() userId: number) {
        return await this.reportService.getBen(userId);
    }
    //어드민 벤 상세 명단보기
    @Get("admin/find/:reportId")
    async findBen(
        @UserId() userId: number,
        @Param("reportId") reportId: number,
    ) {
        console.log(userId);
        console.log(reportId);
        return await this.reportService.findBen(userId, reportId);
    }
    //어드민 벤 승인 거절
    @Put("admin/process/:reportId")
    async processBen(
        @UserId() userId: number,
        @Param("reportId") reportId: number,
        @Body() reportProcessDTO: ReportProcessDTO,
    ) {
        console.log(userId);
        console.log(reportId);
        console.log(reportProcessDTO);
        return await this.reportService.processBen(
            userId,
            reportId,
            reportProcessDTO,
        );
    }
}
