import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    UseGuards,
    HttpStatus,
    Put,
} from "@nestjs/common";
import { CreateQnaCommentDto } from "./dto/createQnaComment.dto";
import { QnaCommentService } from "./qnaComment.service";
import { UpdateQnaCommentDto } from "./dto/updateQnaComment.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { accessTokenGuard } from "src/auth/guard/access-token.guard";
import { UserId } from "src/auth/decorators/userId.decorator";

@ApiTags("QNA댓글")
@ApiBearerAuth("accessToken")
@UseGuards(accessTokenGuard)
@Controller("qna")
export class QnaCommentController {
    constructor(private readonly qnaCommentService: QnaCommentService) {}

    @Post("/:qnaId/comment")
    async createQnaComment(
        @UserId() userId: number,
        @Param("qnaId") qnaId: number,
        @Body()
        createQnaCommentDto: CreateQnaCommentDto,
    ) {
        const data = await this.qnaCommentService.createQnaComment(
            userId,
            qnaId,
            createQnaCommentDto,
        );

        return {
            statusCode: HttpStatus.CREATED,
            message: "QNA 댓글이 생성되었습니다.",
            data,
        };
    }

    @Get("/comment/isAdmin")
    async isAdmin(@UserId() userId: number) {
        console.log(userId);
        return await this.qnaCommentService.verifyAdmin(userId);
    }

    @Get("/:qnaId/comment")
    async findAllQnaComment(@Param("qnaId") qnaId: number) {
        const data = await this.qnaCommentService.findAllQnaComment(qnaId);

        return {
            statusCode: HttpStatus.OK,
            message: "QNA 댓글이 전체조회되었습니다.",
            data,
        };
    }

    @Put("/:qnaId/comment/:qnaCommentId")
    async updateQnaComment(
        @UserId() userId: number,
        @Param("qnaId") qnaId: number,
        @Param("qnaCommentId") qnaCommentId: number,
        @Body() updateQnaCommentDto: UpdateQnaCommentDto,
    ) {
        const data = await this.qnaCommentService.updateQnaComment(
            userId,
            qnaId,
            qnaCommentId,
            updateQnaCommentDto,
        );

        return {
            statusCode: HttpStatus.OK,
            message: "QNA 댓글이 수정되었습니다.",
            data,
        };
    }

    @Delete("/:qnaId/comment/:qnaCommentId")
    async deleteQnaComment(
        @UserId() userId: number,
        @Param("qnaId") qnaId: number,
        @Param("qnaCommentId") qnaCommentId: number,
    ) {
        const data = this.qnaCommentService.deleteQnaComment(
            userId,
            qnaId,
            qnaCommentId,
        );
        return {
            statusCode: HttpStatus.OK,
            message: "QNA 댓글이 삭제되었습니다.",
            data,
        };
    }
}
