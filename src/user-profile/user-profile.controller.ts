import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Req,
    Put,
    UseInterceptors,
    UploadedFile,
} from "@nestjs/common";
import { UserProfileService } from "./user-profile.service";
import { CreateUserProfileDto } from "./dto/create-user-profile.dto";
import { UpdateUserProfileDto } from "./dto/update-user-profile.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { Alarmservice } from "src/alarm/alarm.service";
import { accessTokenGuard } from "src/auth/guard/access-token.guard";
import { UserId } from "src/auth/decorators/userId.decorator";

//개인 프로필
@ApiTags("개인 프로필")
@ApiBearerAuth("accessToken")
@UseGuards(accessTokenGuard)
@Controller("/user")
export class UserProfileController {
    constructor(
        private readonly userProfileService: UserProfileService,
        private readonly alarmService: Alarmservice,
    ) {}

    //프로필 작성하기
    @Post("/me/profile")
    @UseInterceptors(FileInterceptor("file"))
    create(
        @UserId() userId: number,
        @Body() createUserProfileDto: CreateUserProfileDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.userProfileService.create(
            +userId,
            createUserProfileDto,
            file,
        );
    }

    //내 프로필 조회하기
    @Get("/me/profile")
    findMyProfile(@UserId() userId: number) {
        return this.userProfileService.findOne(+userId);
    }

    //특정 프로필 조회하기
    @Get("/:userId/profile")
    findOtherProfileById(@Param("userId") userId: string) {
        console.log(userId);
        return this.userProfileService.findOne(+userId);
    }

    //프로필 수정하기
    @Put("/me/profile")
    @UseInterceptors(FileInterceptor("file"))
    update(
        @UserId() userId: number,
        @Body() updateUserProfileDto: UpdateUserProfileDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.userProfileService.update(
            +userId,
            updateUserProfileDto,
            file,
        );
    }
}
