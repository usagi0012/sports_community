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

@Controller("applying-club")
export class ApplyingClubController {
    constructor(private readonly applyingClubService: ApplyingClubService) {}

    @UseGuards(accessTokenGuard) // 우리 프로젝트랑 다른데 access토큰 가드가 맞겠지? PR전에 확인하기
    @Post()
    async postApplyingClub(@Body() applicationDto: ApplicationDto) {
        try {
            // userId 부분도 확인하기
            // const user = req.user.id;
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

    @UseGuards(accessTokenGuard)
    @Get()
    async getApplyingClub() {
        try {
            // const userId = req.user.id;
            const application =
                await this.applyingClubService.getApplyingClub(userId);

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

    @UseGuards(accessTokenGuard)
    @Put()
    async updateApplyingClub(@Body() applicationDto: ApplicationDto) {
        try {
            // userId 부분도 확인하기
            // const user = req.user.id;
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

    @UseGuards(accessTokenGuard)
    @Delete()
    async deleteApplyingClub() {
        try {
            // userId 부분도 확인하기
            // const user = req.user.id;
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
