import {
    Controller,
    Body,
    UseGuards,
    HttpStatus,
    Put,
    Post,
    Param,
    Get,
} from "@nestjs/common";
import { PersonalTagCounterDto } from "./dto/personaltagcounter.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { accessTokenGuard } from "src/auth/guard/access-token.guard";
import { UserId } from "src/auth/decorators/userId.decorator";
import { PersonalassessmenttagService } from "./personalassessmenttag.service";
import { CreatePersonalAssessmentDto } from "./dto/create-personal-assessment.dto";
import { Alarmservice } from "src/alarm/alarm.service";

@ApiTags("개인평가지+태그")
@ApiBearerAuth("accessToken")
@UseGuards(accessTokenGuard)
@Controller("/assessment")
export class PersonalassessmenttagController {
    constructor(
        private readonly personalassessmenttagService: PersonalassessmenttagService,
        private readonly alarmService: Alarmservice,
    ) {}
    @Get("/personal/topThree/personality")
    async findTopThreePersonalityAmountUser() {
        const data =
            await this.personalassessmenttagService.findTopThreePersonalityAmountUser();

        return {
            statusCode: HttpStatus.OK,
            message: "개인 인성 종합 점수 탑3 점수가 조회되었습니다.",
            data,
        };
    }

    @Get("/personal/topThree/ability")
    async findTopThreeAbilityAmountUser() {
        const data =
            await this.personalassessmenttagService.findTopThreeAbilityAmountUser();

        return {
            statusCode: HttpStatus.OK,
            message: "개인 실력 종합 점수 탑3 점수가 조회되었습니다.",
            data,
        };
    }

    @Get("/personal")
    async findOneUserAssessment(@UserId() userId: number) {
        const data =
            await this.personalassessmenttagService.findOneUserAssessment(
                userId,
            );

        return {
            statusCode: HttpStatus.OK,
            message: "개인 점수가 조회되었습니다.",
            data,
        };
    }

    @Get("/personal/tag")
    async findOneUserTag(@UserId() userId: number) {
        const data =
            await this.personalassessmenttagService.findOneUserTag(userId);
        return {
            statusCode: HttpStatus.OK,
            message: "개인 태그가 조회되었습니다.",
            data,
        };
    }

    @Get("/personal/:userId")
    async findOtherOneUserAssessment(@Param("userId") userId: number) {
        const data =
            await this.personalassessmenttagService.findOtherOneUserAssessment(
                userId,
            );

        return {
            statusCode: HttpStatus.OK,
            message: "점수가 조회되었습니다.",
            data,
        };
    }

    @Get("/personal/tag/:userId")
    async findOtherOneUserTag(@Param("userId") userId: number) {
        const data =
            await this.personalassessmenttagService.findOtherOneUserTag(userId);
        return {
            statusCode: HttpStatus.OK,
            message: "태그가 조회되었습니다.",
            data,
        };
    }

    @Put("/personal/:matchId/:playOtherUserId")
    async updatePesonalAssessment(
        @Param("matchId") matchId: number,
        @Param("playOtherUserId") playOtherUserId: number,
        @UserId() userId: number,
        @Body() createPersonalAssessmentDto: CreatePersonalAssessmentDto,
    ) {
        const data =
            await this.personalassessmenttagService.updatePesonalAssessment(
                matchId,
                playOtherUserId,
                userId,
                createPersonalAssessmentDto,
            );

        this.alarmService.sendAlarm(userId, "개인 평가지가 제출되었습니다.");
        return {
            statusCode: HttpStatus.OK,
            message: "개인 평가지가 제출되었습니다.",
            data,
        };
    }

    @Put("/personal/tag/:matchId/:playOtherUserId")
    async updatePesonalTag(
        @Param("matchId") matchId: number,
        @Param("playOtherUserId") playOtherUserId: number,
        @UserId() userId: number,
        @Body() personalTagCounterDto: PersonalTagCounterDto,
    ) {
        const data = await this.personalassessmenttagService.updatePesonalTag(
            matchId,
            playOtherUserId,
            userId,
            personalTagCounterDto,
        );

        this.alarmService.sendAlarm(userId, "개인 태그가 제출되었습니다.");
        return {
            statusCode: HttpStatus.OK,
            message: "개인 태그가 제출되었습니다.",
            data,
        };
    }
}
