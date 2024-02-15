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

    //친구 추가하기
    @Post("post/friend/:otherUserId")
    async friednUser(
        @UserId() userId: number,
        @Param("otherUserId") otherUserId: number,
    ) {
        return await this.userProfileService.friednUser(userId, otherUserId);
    }

    // 친구 삭제하기
    @Delete("delete/friend/:otherUserId")
    async deleteFriend(
        @UserId() userId: number,
        @Param("otherUserId") otherUserId: number,
    ) {
        return await this.userProfileService.deleteFriend(userId, otherUserId);
    }

    //block fried
    @Post("post/block/:otherUserId")
    async blockUser(
        @UserId() userId: number,
        @Param("otherUserId") otherUserId: number,
    ) {
        return await this.userProfileService.blockUser(userId, otherUserId);
    }

    //dlelteblock fried
    @Delete("delete/block/:otherUserId")
    async deleteBlock(
        @UserId() userId: number,
        @Param("otherUserId") otherUserId: number,
    ) {
        return await this.userProfileService.deleteFriend(userId, otherUserId);
    }

    //친구 목록 불러오기
    @Get("get/friend")
    async getFriend(@UserId() userId: number) {
        return await this.userProfileService.getFriend(userId);
    }

    //친구인지 아닌지
    @Get("find/friend/:otherUserId")
    async findFriend(
        @UserId() userId: number,
        @Param("otherUserId") otherUserId: number,
    ) {
        return await this.userProfileService.findFriend(userId, otherUserId);
    }

    //블락유저 목록 불러오기
    @Get("get/block")
    async getBlock(@UserId() userId: number) {
        return await this.userProfileService.getBlock(userId);
    }

    //블락 인지 아닌지
    @Get("find/block/:otherUserId")
    async findBlock(
        @UserId() userId: number,
        @Param("otherUserId") otherUserId: number,
    ) {
        return await this.userProfileService.findBlock(userId, otherUserId);
    }
}
