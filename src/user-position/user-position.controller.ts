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
    Query,
} from "@nestjs/common";
import { UserPositionService } from "./user-position.service";
import { CreateUserPositionDto } from "./dto/create-user-position.dto";
import { UpdateUserPositionDto } from "./dto/update-user-position.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";

@ApiTags("개인 포지션")
@ApiBearerAuth()
@UseGuards(AuthGuard("accessToken"))
@Controller("/user/me/position")
export class UserPositionController {
    constructor(private readonly userPositionService: UserPositionService) {}

    //선호 포지션 등록하기
    @Post("")
    create(
        @Req() req: any,
        @Body() createUserPositionDto: CreateUserPositionDto,
    ) {
        const userId = +req.user.userId;
        return this.userPositionService.create(userId, createUserPositionDto);
    }

    //내 선호 포지션 조회하기
    @Get()
    findOne(@Req() req: any) {
        const userId = +req.user.userId;
        return this.userPositionService.findOne(+userId);
    }

    //선호 포지션 수정하기
    @Put()
    update(
        @Req() req: any,
        @Body() updateUserPositionDto: UpdateUserPositionDto,
    ) {
        const userId = +req.user.userId;
        return this.userPositionService.update(+userId, updateUserPositionDto);
    }

    //포지션삭제;
    @Delete()
    remove(@Req() req: any) {
        const userId = +req.user.userId;
        return this.userPositionService.remove(+userId);
    }
}
