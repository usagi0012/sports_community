import {
    Controller,
    Post,
    Req,
    Res,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import { AwsService } from "./aws.service";
import { ApiBearerAuth } from "@nestjs/swagger";
import { accessTokenGuard } from "../auth/guard/access-token.guard";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("aws")
@ApiBearerAuth("accessToken")
@UseGuards(accessTokenGuard)
export class AwsController {
    constructor(private readonly awsService: AwsService) {}

    // async create(@Req() request, @Res() response) {
    //     try {
    //         await this.awsService.fileupload(request, response);
    //     } catch (error) {
    //         return response
    //             .status(500)
    //             .json(`Failed to upload image file: ${error.message}`);
    //     }
    // }

    // @Post()
    // @UseInterceptors(FileInterceptor("file"))
    // uploadFile(@UploadedFile() file: Express.Multer.File) {
    //     return this.awsService.fileupload(file);
    // }
}
