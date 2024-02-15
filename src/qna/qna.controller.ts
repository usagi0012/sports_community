import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    UseInterceptors,
    UploadedFile,
    HttpStatus,
    Put,
} from "@nestjs/common";
import { QnaService } from "./qna.service";

import { FileInterceptor } from "@nestjs/platform-express";
import { ApiTags } from "@nestjs/swagger";
import { UserId } from "src/auth/decorators/userId.decorator";

@ApiTags("FAQ")
@Controller("qna")
export class QnaController {
    constructor(private readonly qnaService: QnaService) {}

    @UseInterceptors(FileInterceptor("file"))
    @Post()
    async createQna(
        @UserId() userId: number,
        @Body() createFaqDto: CreateFaqDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        const data = await this.qnaService.createQna(
            userId,
            createFaqDto,
            file,
        );

        return {
            statusCode: HttpStatus.CREATED,
            message: "QNA 작성에 성공했습니다.",
            data,
        };
    }

    @Get()
    async findAllQna() {
        const data = await this.qnaService.findAllQna();
        return {
            statusCode: HttpStatus.OK,
            message: "QNA 전체조회되었습니다.",
            data,
        };
    }

    @Get(":qnaId")
    async findOneQna(@Param("qnaId") qnaId: number) {
        const data = await this.qnaService.findOneQna(qnaId);
        return {
            statusCode: HttpStatus.OK,
            message: "FAQ가 상세조회되었습니다.",
            data,
        };
    }

    @UseInterceptors(FileInterceptor("file"))
    @Put(":faqid")
    async updateQna(
        @UserId() userId: number,
        @Param("faqid") faqid: number,
        @Body() updateFaqDto: UpdateFaqDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        const data = await this.qnaService.updateQna(
            userId,
            faqid,
            file,
            updateFaqDto,
        );
        return {
            statusCode: HttpStatus.OK,
            message: "FAQ가 업데이트되었습니다.",
            data,
        };
    }

    @Delete(":faqId")
    async deleteQna(@UserId() userId: number, @Param("faqId") faqId: number) {
        const data = await this.qnaService.deleteFaq(userId, faqId);

        return {
            statusCode: HttpStatus.OK,
            message: "FAQ가 삭제되었습니다.",
            data,
        };
    }
}
