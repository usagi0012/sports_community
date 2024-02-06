import {
    Controller,
    Post,
    Body,
    Param,
    UseGuards,
    HttpStatus,
    Put,
    Get,
} from "@nestjs/common";
import { ClubassessmenttagService } from "./clubassessmenttag.service";
import { CreateClubassessmenttagDto } from "./dto/create-clubassessmenttag.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { accessTokenGuard } from "src/auth/guard/access-token.guard";
import { ClubTagCounterDto } from "./dto/clubtagcounter.dto";
import { UserId } from "src/auth/decorators/userId.decorator";

@ApiTags("클럽평가지+태그")
@ApiBearerAuth("accessToken")
@UseGuards(accessTokenGuard)
@Controller("assessment")
export class ClubassessmenttagController {
    constructor(
        private readonly clubassessmenttagService: ClubassessmenttagService,
    ) {}

    @Get("/club")
    async findTopThreeClub() {
        const data = await this.clubassessmenttagService.findTopThreeClub();

        return {
            statusCode: HttpStatus.OK,
            message: "클럽 탑 3점수가 조회되었습니다.",
            data,
        };
    }

    @Get("/club/:clubId")
    async findOneClubAssessment(@Param("clubId") clubId: number) {
        const data =
            await this.clubassessmenttagService.findOneClubAssessment(clubId);

        return {
            statusCode: HttpStatus.OK,
            message: "클럽 점수가 조회되었습니다.",
            data,
        };
    }

    @Get("/club/tag/:clubId")
    async findOneClubTag(@Param("clubId") clubId: number) {
        const data = await this.clubassessmenttagService.findOneClubTag(clubId);
        return {
            statusCode: HttpStatus.OK,
            message: "클럽 태그가 조회되었습니다.",
            data,
        };
    }

    @Put("/club/:clubMatchId/:myClubId")
    async updateClubAssessment(
        @Param("clubMatchId") clubMatchId: number,
        @Param("myClubId") myClubId: number,
        @Body() createClubAssessmenttagDto: CreateClubassessmenttagDto,
    ) {
        const data = this.clubassessmenttagService.updateClubAssessment(
            +clubMatchId,
            +myClubId,
            createClubAssessmenttagDto,
        );

        return {
            statusCode: HttpStatus.CREATED,
            message: "클럽 평가지와 태그가 제출되었습니다.",
            data,
        };
    }

    @Put("/club/tag/:clubMatchId/:myClubId")
    async updateClubTag(
        @Param("clubMatchId") clubMatchId: number,
        @Param("myClubId") myClubId: number,
        @Body() clubTagCounterDto: ClubTagCounterDto,
    ) {
        const data = this.clubassessmenttagService.updateClubTag(
            +clubMatchId,
            +myClubId,
            clubTagCounterDto,
        );

        return {
            statusCode: HttpStatus.CREATED,
            message: "클럽 태그가 제출되었습니다.",
            data,
        };
    }
}
