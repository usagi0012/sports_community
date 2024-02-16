import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    HttpStatus,
    Put,
} from "@nestjs/common";
import { QnaService } from "./qna.service";
import { CreateQnaDto } from "./dto/createQna.dto";
import { UpdateQnaDto } from "./dto/updateQna.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { accessTokenGuard } from "src/auth/guard/access-token.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { UserId } from "src/auth/decorators/userId.decorator";

@ApiTags("QNA")
@Controller("qna")
@ApiBearerAuth("accessToken")
@UseGuards(accessTokenGuard)
export class QnaController {
    constructor(private readonly qnaService: QnaService) {}

    @UseInterceptors(FileInterceptor("file"))
    @Post()
    async createQna(
        @UserId() userId: number,
        @Body() createQnaDto: CreateQnaDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        const data = await this.qnaService.createQna(
            userId,
            createQnaDto,
            file,
        );

        return {
            statusCode: HttpStatus.CREATED,
            message: "QNA가 생성되었습니다.",
            data,
        };
    }

    @Get()
    async findAllQna() {
        const data = await this.qnaService.findAllQna();

        return {
            statusCode: HttpStatus.OK,
            message: "QNA가 전체조회되었습니다.",
            data,
        };
    }

    @Get(":qnaId")
    async findOneQna(@Param("qnaId") qnaId: number) {
        const data = await this.qnaService.findOneQna(qnaId);
        return {
            statusCode: HttpStatus.OK,
            message: "QNA가 상세조회되었습니다.",
            data,
        };
    }

    @UseInterceptors(FileInterceptor("file"))
    @Put(":qnaId")
    async updateQna(
        @UserId() userId: number,
        @Param("qnaId") qnaId: number,
        @UploadedFile() file: Express.Multer.File,
        @Body() updateQnaDto: UpdateQnaDto,
    ) {
        const data = await this.qnaService.updateQna(
            userId,
            qnaId,
            file,
            updateQnaDto,
        );

        return {
            statusCode: HttpStatus.OK,
            message: "QNA가 수정되었습니다.",
            data,
        };
    }

    @Delete(":qnaId")
    async deleteQna(@Param("qnaId") qnaId: number, @UserId() userId: number) {
        const data = await this.qnaService.deleteQna(qnaId, userId);

        return {
            statusCode: HttpStatus.OK,
            message: "QNA가 삭제되었습니다.",
            data,
        };
    }
}
