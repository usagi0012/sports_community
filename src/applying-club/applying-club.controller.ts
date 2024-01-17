import {
    Body,
    Controller,
    Delete,
    Get,
    Post,
    Put,
    UseGuards,
} from "@nestjs/common";
import { ApplyingClubService } from "./applying-club.service";
import { ApplicationDto } from "./dto/application.dto";
import { accessTokenGuard } from "src/auth/guard/access-token.guard";
import { UserId } from "src/auth/decorators/userId.decorator";
import { ApiBearerAuth } from "@nestjs/swagger";

@Controller("applying-club")
export class ApplyingClubController {
    constructor(private readonly applyingClubService: ApplyingClubService) {}

    @ApiBearerAuth("accessToken")
    @UseGuards(accessTokenGuard)
    @Post()
    async postApplyingClub(
        @UserId() userId: number,
        @Body() applicationDto: ApplicationDto,
    ) {
        try {
            // clubId 쿼리로 가져올까..
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

    @ApiBearerAuth("accessToken")
    @UseGuards(accessTokenGuard)
    @Put()
    async updateApplyingClub(
        @UserId() userId: number,
        @Body() applicationDto: ApplicationDto,
    ) {
        try {
            // clubId 쿼리로 가져와야하나..
            const updatedApplication =
                await this.applyingClubService.updateApplyingClub(
                    applicationDto,
                    userId,
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

    @ApiBearerAuth("accessToken")
    @UseGuards(accessTokenGuard)
    @Delete()
    async deleteApplyingClub(@UserId() userId: number) {
        try {
            // clubId 쿼리로 가져와야하나..
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
