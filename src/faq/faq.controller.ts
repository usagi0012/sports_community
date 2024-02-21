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
import { FaqService } from "./faq.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { accessTokenGuard } from "src/auth/guard/access-token.guard";
import { UserId } from "src/auth/decorators/userId.decorator";
import { FileInterceptor } from "@nestjs/platform-express";
import { CreateFaqDto } from "./dto/createFaq.dto";
import { UpdateFaqDto } from "./dto/updateFaq.dto";

@ApiTags("FAQ")
@ApiBearerAuth("accessToken")
@Controller("faq")
export class FaqController {
    constructor(private readonly faqService: FaqService) {}

    @UseGuards(accessTokenGuard)
    @UseInterceptors(FileInterceptor("file"))
    @Post()
    async createFaq(
        @UserId() userId: number,
        @Body() createFaqDto: CreateFaqDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        const data = await this.faqService.createFaq(
            userId,
            file,
            createFaqDto,
        );

        return {
            statusCode: HttpStatus.CREATED,
            message: "FAQ 작성에 성공했습니다.",
            data,
        };
    }

    @Get()
    async findAllFaq() {
        const data = await this.faqService.findAllFaq();
        return {
            statusCode: HttpStatus.OK,
            message: "FAQ가 전체조회되었습니다.",
            data,
        };
    }

    @Get(":faqId")
    async findOneFaq(@Param("faqId") faqId: number) {
        const data = await this.faqService.findOneFaq(faqId);
        return {
            statusCode: HttpStatus.OK,
            message: "FAQ가 상세조회되었습니다.",
            data,
        };
    }

    @UseGuards(accessTokenGuard)
    @UseInterceptors(FileInterceptor("file"))
    @Put(":faqid")
    async updateFaq(
        @UserId() userId: number,
        @Param("faqid") faqid: number,
        @UploadedFile() file: Express.Multer.File,
        @Body() updateFaqDto: UpdateFaqDto,
    ) {
        const data = await this.faqService.updateFaq(
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

    @UseGuards(accessTokenGuard)
    @Delete(":faqId")
    async deleteFaq(@UserId() userId: number, @Param("faqId") faqId: number) {
        const data = await this.faqService.deleteFaq(userId, faqId);

        return {
            statusCode: HttpStatus.OK,
            message: "FAQ가 삭제되었습니다.",
            data,
        };
    }
}
