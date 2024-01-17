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
} from "@nestjs/common";
import { UserProfileService } from "./user-profile.service";
import { CreateUserProfileDto } from "./dto/create-user-profile.dto";
import { UpdateUserProfileDto } from "./dto/update-user-profile.dto";
import { ApiBearerAuth } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";

@ApiBearerAuth()
@UseGuards(AuthGuard("accessToken"))
@Controller("/user")
export class UserProfileController {
    constructor(private readonly userProfileService: UserProfileService) {}

    //프로필 작성하기
    @Post("/me/profile")
    create(
        @Req() req: any,
        @Body() createUserProfileDto: CreateUserProfileDto,
    ) {
        const userId = req.user.userId;
        return this.userProfileService.create(+userId, createUserProfileDto);
    }

    //내 프로필 조회하기
    @Get("/me/profile")
    findMyProfile(@Req() req: any) {
        const userId = req.user.userId;
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
    update(
        @Req() req: any,
        @Body() updateUserProfileDto: UpdateUserProfileDto,
    ) {
        const userId = req.user.userId;
        return this.userProfileService.update(+userId, updateUserProfileDto);
    }
}
