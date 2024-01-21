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
import { ApplyingClubService } from "./applying-club.service";
import { ApplicationDto } from "./dto/application.dto";
import { accessTokenGuard } from "src/auth/guard/access-token.guard";
import { UserId } from "src/auth/decorators/userId.decorator";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { PermissionApplicationDto } from "./dto/permission-application.dto";
import { ApplicationReviewDto } from "./dto/applicationReview.dto";

@ApiTags("동아리 신청")
@Controller("applying-club")
export class ApplyingClubController {
    constructor(private readonly applyingClubService: ApplyingClubService) {}

    // 동호회 신청
    @ApiBearerAuth("accessToken")
    @UseGuards(accessTokenGuard)
    @Post()
    async postApplyingClub(
        @UserId() userId: number,
        @Body() applicationDto: ApplicationDto,
    ) {
        try {
            const application = await this.applyingClubService.postApplyingClub(
                applicationDto,
                userId,
            );

            return {
                statusCode: 200,
                message: "동호회 지원에 성공했습니다.",
                data: application,
            };
        } catch (error) {
            return {
                statusCode: 400,
                message: "동호회 지원에 실패했습니다.",
                error: error.message,
            };
        }
    }

    // 동호회에게 온 신청서 조회
    @ApiBearerAuth("accessToken")
    @UseGuards(accessTokenGuard)
    @Get(":clubId")
    async getApplicationOfMyClub(
        @Param("clubId") clubId: number,
        @UserId() userId: number,
    ) {
        try {
            const application =
                await this.applyingClubService.getApplicationOfMyClub(
                    clubId,
                    userId,
                );

            return {
                statusCode: 200,
                message: "동호회 신청서 조회에 성공했습니다.",
                data: application,
            };
        } catch (error) {
            return {
                statusCode: 400,
                message: "동호회 신청서 조회에 실패했습니다.",
                error: error.message,
            };
        }
    }

    // 동호회 신청 수락/거절
    @ApiBearerAuth("accessToken")
    @UseGuards(accessTokenGuard)
    @Put(":clubId/:applicationId")
    async reviewApplication(
        @Body() applicationReviewDto: ApplicationReviewDto,
        @UserId() userId: number,
        @Param("clubId") clubId: number,
        @Param("applicationId") applicationId: number,
    ) {
        try {
            const permission = await this.applyingClubService.reviewApplication(
                applicationReviewDto,
                userId,
                clubId,
                applicationId,
            );

            return {
                statusCode: 200,
                message: "동호회 신청 승인/거절에 성공했습니다.",
                data: permission,
            };
        } catch (error) {
            return {
                statusCode: 400,
                message: "동호회 신청 승인/거절에 실패했습니다.",
                error: error.message,
            };
        }
    }

    // git commit test
    // 내 신청서 조회
    @ApiBearerAuth("accessToken")
    @UseGuards(accessTokenGuard)
    @Get()
    async getApplyingClub(@UserId() userId: number) {
        try {
            const application =
                await this.applyingClubService.getApplyingClub(userId);
            console.log(userId);
            return {
                statusCode: 200,
                message: "동호회 지원서 조회에 성공했습니다.",
                data: application,
            };
        } catch (error) {
            return {
                statusCode: 400,
                message: "동호회 지원서 조회에 실패했습니다.",
                error: error.message,
            };
        }
    }

    // 내 신청서 수정
    @ApiBearerAuth("accessToken")
    @UseGuards(accessTokenGuard)
    @Put(":clubId")
    async updateApplyingClub(
        @UserId() userId: number,
        @Body() permissionApplicationDto: PermissionApplicationDto,
        @Param("clubId") clubId: number,
    ) {
        try {
            const updatedApplication =
                await this.applyingClubService.updateApplyingClub(
                    permissionApplicationDto,
                    userId,
                    clubId,
                );

            return {
                statusCode: 200,
                message: "동호회 지원서 변경에 성공했습니다.",
                data: updatedApplication,
            };
        } catch (error) {
            return {
                statusCode: 400,
                message: "동호회 지원서 변경에 실패했습니다.",
                error: error.message,
            };
        }
    }

    // 내 신청서 삭제
    @ApiBearerAuth("accessToken")
    @UseGuards(accessTokenGuard)
    @Delete()
    async deleteApplyingClub(@UserId() userId: number) {
        try {
            const deletedApplication =
                await this.applyingClubService.deleteApplyingClub(userId);

            return {
                statusCode: 200,
                message: "동호회 지원서 삭제에 성공했습니다.",
                data: deletedApplication,
            };
        } catch (error) {
            return {
                statusCode: 400,
                message: "동호회 지원서 삭제에 실패했습니다.",
                error: error.message,
            };
        }
    }
}
