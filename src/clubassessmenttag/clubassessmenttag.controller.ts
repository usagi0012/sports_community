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

    @Post("/club/:clubMatchId/:clubId")
    async createClubAssessment(
        @Param("clubMatchId") clubMatchId: number,
        @Param("clubId") clubId: number,
        @UserId() userId: number,
        @Body() createClubAssessmenttagDto: CreateClubassessmenttagDto,
    ) {
        const data = await this.clubassessmenttagService.createClubAssessment(
            clubMatchId,
            clubId,
            userId,
            createClubAssessmenttagDto,
        );

        return {
            statusCode: HttpStatus.OK,
            message: "클럽 평가지가 제출되었습니다.",
            data,
        };
    }

    @Post("/club/tag/:clubMatchId/:clubId")
    async createClubTag(
        @Param("clubMatchId") clubMatchId: number,
        @Param("clubId") clubId: number,
        @UserId() userId: number,
        @Body() clubTagCounterDto: ClubTagCounterDto,
    ) {
        const data = await this.clubassessmenttagService.createClubTag(
            clubMatchId,
            clubId,
            userId,
            clubTagCounterDto,
        );

        return {
            statusCode: HttpStatus.OK,
            message: "클럽 태그가 제출되었습니다.",
            data,
        };
    }

    @Put("/club/:clubMatchId/:clubId")
    async updateClubAssessment(
        @Param("clubMatchId") clubMatchId: number,
        @Param("clubId") clubId: number,
        @UserId() userId: number,
        @Body() createClubAssessmenttagDto: CreateClubassessmenttagDto,
    ) {
        const data = this.clubassessmenttagService.updateClubAssessment(
            clubMatchId,
            clubId,
            userId,
            createClubAssessmenttagDto,
        );

        return {
            statusCode: HttpStatus.CREATED,
            message: "클럽 평가지와 태그가 제출되었습니다.",
            data,
        };
    }

    @Put("/club/tag/:clubMatchId/:clubId")
    async updateClubTag(
        @Param("clubMatchId") clubMatchId: number,
        @Param("clubId") clubId: number,
        @UserId() userId: number,
        @Body() clubTagCounterDto: ClubTagCounterDto,
    ) {
        const data = this.clubassessmenttagService.updateClubTag(
            clubMatchId,
            clubId,
            userId,
            clubTagCounterDto,
        );

        return {
            statusCode: HttpStatus.CREATED,
            message: "클럽 태그가 제출되었습니다.",
            data,
        };
    }
}
