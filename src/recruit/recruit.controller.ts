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
import { AuthGuard } from "@nestjs/passport";
import { RecruitService } from "./recruit.service";
import { UserInfo } from "src/utils/userInfo.decorator";
import { User } from "src/entity/user.entity";

@Controller("recruit")
@UseGuards(AuthGuard("jwt"))
export class RecruitController {
    constructor(private readonly recruitService: RecruitService) {}

    //모집 글 등록
    @Post("")
    async postRecruit(@UserInfo() user: User, @Body() recruitDTO: RecruitDTO) {
        const hostid = user.id;
        return await this.recruitService.postRecruit(hostid, recruitDTO);
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
        @UserInfo() user: User,
        @Body() recruitDTO: RecruitDTO,
        @Param("id") id: number,
    ) {
        const hostid = user.id;

        return await this.recruitService.putRecruit(hostid, recruitDTO, id);
    }

    //모집 글 status 수정
    @Put("status/:id")
    async updateRecruit(
        @UserInfo() user: User,
        @Body() updateDto: UpdateDto,
        @Param("id") id: number,
    ) {
        const hostid = user.id;
        return await this.recruitService.updateRecruit(hostid, updateDto, id);
    }
    //모집 글 삭제
    @Get(":id")
    async deleteRecruit(@UserInfo() user: User, @Param("id") id: number) {
        const hostid = user.id;
        return await this.recruitService.deleteRecruit(hostid, id);
    }
}
