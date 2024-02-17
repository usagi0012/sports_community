import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    HttpStatus,
    Put,
    UseGuards,
    UseInterceptors,
    UploadedFile,
} from "@nestjs/common";
import { NoticeService } from "./notice.service";
import { CreateNoticeDto } from "./dto/createNotice.dto";
import { UpdateNoticeDto } from "./dto/updateNotice.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { accessTokenGuard } from "src/auth/guard/access-token.guard";
import { UserId } from "src/auth/decorators/userId.decorator";
import { FileInterceptor } from "@nestjs/platform-express";

// @ApiBearerAuth("accessToken")
// @UseGuards(accessTokenGuard)
@ApiTags("공지사항")
@Controller("notice")
export class NoticeController {
    constructor(private readonly noticeService: NoticeService) {}

    @UseInterceptors(FileInterceptor("file"))
    @Post()
    async createNotice(
        @UserId() userId: number,
        @Body() createNoticeDto: CreateNoticeDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        const data = await this.noticeService.createNotice(
            userId,
            file,
            createNoticeDto,
        );

        return {
            statusCode: HttpStatus.CREATED,
            message: "공지사항이 생성되었습니다.",
            data,
        };
    }

    @ApiBearerAuth("accessToken")
    @UseGuards(accessTokenGuard)
    @Get("/isAdmin")
    async isAdmin(@UserId() userId: number) {
        console.log("here");
        return await this.noticeService.verifyAdmin(userId);
    }

    @Get()
    async findAllNotice() {
        const data = await this.noticeService.findAllNotice();
        return {
            statusCode: HttpStatus.OK,
            message: "공지사항이 전체조회되었습니다.",
            data,
        };
    }

    @Get(":noticeId")
    async findOneNotice(@Param("noticeId") noticeId: number) {
        const data = await this.noticeService.findOneNotice(noticeId);
        return {
            statusCode: HttpStatus.OK,
            message: "공지사항이 상세조회되었습니다.",
            data,
        };
    }

    @UseInterceptors(FileInterceptor("file"))
    @Put(":noticeId")
    async updateNotice(
        @UserId() userId: number,
        @Param("noticeId") noticeId: number,
        @UploadedFile() file: Express.Multer.File,
        @Body() updateNoticeDto: UpdateNoticeDto,
    ) {
        const data = await this.noticeService.updateNotice(
            userId,
            noticeId,
            file,
            updateNoticeDto,
        );
        return {
            statusCode: HttpStatus.OK,
            message: "공지사항이 수정되었습니다.",
            data,
        };
    }

    @Delete(":noticeId")
    async deleteNotice(
        @Param("noticeId") noticeId: number,
        @UserId() userId: number,
    ) {
        const data = await this.noticeService.deleteNotice(noticeId, userId);
        return {
            statusCode: HttpStatus.OK,
            message: "공지사항이 삭제되었습니다.",
            data,
        };
    }
}
