import {
    Controller,
    Post,
    Body,
    Param,
    UseGuards,
    HttpStatus,
    Put,
} from "@nestjs/common";
import { ClubassessmenttagService } from "./clubassessmenttag.service";
import { CreateClubassessmenttagDto } from "./dto/create-clubassessmenttag.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { accessTokenGuard } from "src/auth/guard/access-token.guard";
import { ClubTagCounterDto } from "./dto/clubtagcounter.dto";

@ApiTags("클럽평가지+태그")
@ApiBearerAuth("accessToken")
@UseGuards(accessTokenGuard)
@Controller("assessment")
export class ClubassessmenttagController {
    constructor(
        private readonly clubassessmenttagService: ClubassessmenttagService,
    ) {}

    @Post("/club/:clubId")
    async createClubAssessment(
        @Param() clubId: number,
        @Body() createClubAssessmenttagDto: CreateClubassessmenttagDto,
    ) {
        const data = await this.clubassessmenttagService.createClubAssessment(
            clubId,
            createClubAssessmenttagDto,
        );

        return {
            statusCode: HttpStatus.OK,
            message: "클럽 평가지가 제출되었습니다.",
            data,
        };
    }

    @Post("/club/tag/:clubId")
    async createClubTag(
        @Param() clubId: number,
        @Body() clubTagCounterDto: ClubTagCounterDto,
    ) {
        const data = await this.clubassessmenttagService.createClubTag(
            clubId,
            clubTagCounterDto,
        );

        return {
            statusCode: HttpStatus.OK,
            message: "클럽 태그가 제출되었습니다.",
            data,
        };
    }

    @Put("/club/:clubId/:userId")
    async updateClubAssessment(
        @Param("clubId") clubId: number,
        @Param("userId") userId: number,
        @Body() createClubAssessmenttagDto: CreateClubassessmenttagDto,
    ) {
        const data = this.clubassessmenttagService.updateClubAssessment(
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

    @Put("/club/tag/:clubId/:userId")
    async updateClubTag(
        @Param("clubId") clubId: number,
        @Param("userId") userId: number,
        @Body() clubTagCounterDto: ClubTagCounterDto,
    ) {
        const data = this.clubassessmenttagService.updateClubTag(
            clubId,
            userId,
            clubTagCounterDto,
        );

        return {
            statusCode: HttpStatus.CREATED,
            message: "클럽 평가지와 태그가 제출되었습니다.",
            data,
        };
    }
}
