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
import { ApiBearerAuth } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";

// @ApiBearerAuth()
// @UseGuards(AuthGuard("accessToken"))
@Controller("/user/me/position")
export class UserPositionController {
    constructor(private readonly userPositionService: UserPositionService) {}

    //선호 포지션 등록하기
    @Post("1")
    create(@Req() req: any) {
        const userId = +req.user.userId;
        const createUserPositionDto: CreateUserPositionDto = req.body;
        return this.userPositionService.create(userId, createUserPositionDto);
    }

    //내 선호 포지션 조회하기
    @Get()
    findOne(@Req() req: any) {
        const userId = +req.user.userId;
        return this.userPositionService.findOne(+userId);
    }

    //선호 포지션 수정하기
    @Post()
    update(@Body() updateUserPositionDto: UpdateUserPositionDto) {
        console.log(updateUserPositionDto.center);
        console.log(updateUserPositionDto);
        // const userId = +req.user.userId;
        return "1";
        // return this.userPositionService.update(+userId, updateUserPositionDto);
    }

    //포지션삭제
    // @Delete()
    // remove(@Req() req: any) {
    //     const userId = +req.user.userId;
    //     return this.userPositionService.remove(+userId);
    // }
}
