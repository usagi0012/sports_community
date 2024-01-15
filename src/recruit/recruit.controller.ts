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

@Controller("recruit")
@UseGuards(AuthGuard("jwt"))
export class RecruitController {
    constructor(private readonly recruitService: RecruitService) {}

    //모집 글 등록
    @Post("")
    async postRecruit(@Body() recruitDTO: RecruitDTO) {
        return await this.recruitService.postRecruit(recruitDTO);
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
    async putRecruit(@Body() recruitDTO: RecruitDTO, @Param("id") id: number) {
        return await this.recruitService.putRecruit(recruitDTO, id);
    }

    //모집 글 status 수정
    @Put("status/:id")
    async updateRecruit(@Body() updateDto: UpdateDto, @Param("id") id: number) {
        return await this.recruitService.updateRecruit(updateDto, id);
    }
    //모집 글 삭제
    @Get(":id")
    async deleteRecruit(@Param("id") id: number) {
        return await this.recruitService.deleteRecruit(id);
    }
}
