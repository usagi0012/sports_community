import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    UseGuards,
} from "@nestjs/common";
import { accessTokenGuard } from "../auth/guard/access-token.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { BanlistService } from "./banlist.service";
import { UserId } from "../auth/decorators/userId.decorator";
import { PenaltyDTO } from "./dto/Penalty.dto";

import { UserTypeGuard } from "src/auth/guard/roles.guard";
import { Usertypes } from "src/auth/decorators/roles.decorator";
import { UserType } from "./../entity/user.entity";

@ApiTags("밴 리스트")
@ApiBearerAuth("accessToken")
@UseGuards(accessTokenGuard)
@Controller("banlist")
export class BanlistController {
    constructor(private readonly banlistService: BanlistService) {}

    // 신고받은 회원 경고하기
    @Post("warning/:banUserId")
    async warningUser(
        @UserId() userId: number,
        @Param("banUserId") banUserId: number,
    ) {
        return this.banlistService.warningUser(userId, banUserId);
    }

    // 신고받은 회원 징계하기
    @Post("penalty/:banUserId")
    async penaltyUser(
        @UserId() userId: number,
        @Param("banUserId") banUserId: number,
        @Body() penaltyDTO: PenaltyDTO,
    ) {
        return this.banlistService.penaltyUser(userId, banUserId, penaltyDTO);
    }

    // 신고받은 회원 영구징계하기
    @Post("permanentBan/:banUserId")
    async permanentBanUser(
        @UserId() userId: number,
        @Param("banUserId") banUserId: number,
    ) {
        return this.banlistService.permanentBanUser(userId, banUserId);
    }

    // 유저아이디를 통한 벤리스트 조회하기
    @Get("banlist/:banUserId")
    async getBanList(
        @UserId() userId: number,
        @Param("banUserId") banUserId: number,
    ) {
        return this.banlistService.getBanList(userId, banUserId);
    }

    // 징계 취소하기

    @Delete("banlist/cancel/:banListId")
    async cancelBan(
        @UserId() userId: number,
        @Param("banListId") banListId: number,
        z,
    ) {
        return this.banlistService.cancelBan(userId, banListId);
    }
}
