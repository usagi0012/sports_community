import {
    Controller,
    Body,
    Param,
    Get,
    Put,
    Post,
    UseGuards,
} from "@nestjs/common";

import { RecruitDTO, UpdateDto } from "./dto/recruit.dto";
import { RecruitService } from "./recruit.service";
import { User } from "../entity/user.entity";
import { accessTokenGuard } from "src/auth/guard/access-token.guard";
import { UserId } from "src/auth/decorators/userId.decorator";
import { ApiBearerAuth } from "@nestjs/swagger";

@Controller("recruit")
@ApiBearerAuth("accessToken")
@UseGuards(accessTokenGuard)
export class RecruitController {
    constructor(private readonly recruitService: RecruitService) {}

    //모집 글 등록
    @Post("")
    async postRecruit(
        @UserId() userId: number,
        @Body() recruitDTO: RecruitDTO,
    ) {
        const hostId = userId;
        return await this.recruitService.postRecruit(hostId, recruitDTO);
    }
    //모집 글 조회
    @Get("")
    async getRecruit() {
        return await this.recruitService.getRecruit();
    }
    //모집 글 상세조회
    @Get(":id")
    async findRecruit(@Param("id") id: number) {
        return await this.recruitService.findRecruit(id);
    }

    //모집 글 수정
    @Put(":id")
    async putRecruit(
        @UserId() userId: number,
        @Body() recruitDTO: RecruitDTO,
        @Param("id") id: number,
    ) {
        const hostId = userId;

        return await this.recruitService.putRecruit(hostId, recruitDTO, id);
    }

    //모집 글 status 수정
    @Put("status/:id")
    async updateRecruit(
        @UserId() userId: number,
        @Body() updateDto: UpdateDto,
        @Param("id") id: number,
    ) {
        const hostId = userId;
        return await this.recruitService.updateRecruit(hostId, updateDto, id);
    }
    //모집 글 삭제
    @Get(":id")
    async deleteRecruit(@UserId() userId: number, @Param("id") id: number) {
        const hostId = userId;
        return await this.recruitService.deleteRecruit(hostId, id);
    }
}
