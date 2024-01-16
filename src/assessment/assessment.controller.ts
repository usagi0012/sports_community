import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    UseGuards,
    HttpStatus,
} from "@nestjs/common";
import { AssessmentService } from "./assessment.service";
import { CreateAssessmentDto } from "./dto/create-personal-assessment.dto";
import { accessTokenGuard } from "src/auth/guard/access-token.guard";
import { ApiBearerAuth } from "@nestjs/swagger";

@ApiBearerAuth("accessToken")
@UseGuards(accessTokenGuard)
@Controller("assessment")
export class AssessmentController {
    constructor(private readonly assessmentService: AssessmentService) {}

    @Post()
    async create(@Body() createAssessmentDto: CreateAssessmentDto) {
        const data = this.assessmentService.create(createAssessmentDto);

        return {
            statusCode: HttpStatus.CREATED,
            message: "평가지가 제출되었습니다.",
            data,
        };
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.assessmentService.findOne(+id);
    }
}
