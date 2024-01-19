import {
    Controller,
    Body,
    UseGuards,
    HttpStatus,
    Put,
    Post,
    Param,
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

    @Post("/personal")
    async createPersonalAssessment(
        @UserId() userId: number,
        @Body() createPersonalAssessmentDto: CreatePersonalAssessmentDto,
    ) {
        const data =
            await this.personalassessmenttagService.createPersonalAssessment(
                userId,
                createPersonalAssessmentDto,
            );
        this.alarmService.sendAlarm(userId, "평가지가 제출되었습니다.");
        return {
            statusCode: HttpStatus.CREATED,
            message: "개인 평가지가 제출되었습니다.",
            data,
        };
    }

    @Post("/personal/tag")
    async createPersonalTag(
        @UserId() userId: number,
        @Body() personalTagCounterDto: PersonalTagCounterDto,
    ) {
        const data = await this.personalassessmenttagService.createPersonalTag(
            userId,
            personalTagCounterDto,
        );

        this.alarmService.sendAlarm(userId, "개인 태그가 제출되었습니다.");
        return {
            statusCode: HttpStatus.CREATED,
            message: "개인 태그가 제출되었습니다.",
            data,
        };
    }

    @Put("/personal/:userId")
    async updatePesonalAssessment(
        @Param("userId") userId: number,
        @Body() createPersonalAssessmentDto: CreatePersonalAssessmentDto,
    ) {
        const data =
            await this.personalassessmenttagService.updatePesonalAssessment(
                userId,
                createPersonalAssessmentDto,
            );

        this.alarmService.sendAlarm(userId, "개인 평가지가 제출되었습니다.");
        return {
            statusCode: HttpStatus.OK,
            message: "개인 평가지가 수정되었습니다.",
            data,
        };
    }

    @Put("/personal/tag/:userId")
    async updatePesonalTag(
        @Param("userId") userId: number,
        @Body() personalTagCounterDto: PersonalTagCounterDto,
    ) {
        const data = await this.personalassessmenttagService.updatePesonalTag(
            userId,
            personalTagCounterDto,
        );

        this.alarmService.sendAlarm(userId, "개인 태그가 제출되었습니다.");
        return {
            statusCode: HttpStatus.OK,
            message: "개인 태그가 수정되었습니다.",
            data,
        };
    }
}
