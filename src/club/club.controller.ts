import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UseGuards,
} from "@nestjs/common";
import { ClubService } from "./club.service";
import { accessTokenGuard } from "../auth/guard/access-token.guard";
import { UserId } from "../auth/decorators/userId.decorator";
import { ApiBearerAuth } from "@nestjs/swagger";
import { CreateClubDto } from "./dto/createClub.dto";

@Controller("club")
export class ClubController {
    constructor(private readonly clubService: ClubService) {}

    //동아리 전체 조회
    @Get()
    getAllClubs() {
        return this.clubService.getAllClubs();
    }

    //동아리 상세 조회
    @ApiBearerAuth("accessToken")
    @UseGuards(accessTokenGuard)
    @Get("/:clubId")
    getClub(@Param("clubId") id: string) {
        return this.clubService.getClub(+id);
    }

    //동아리 생성
    @ApiBearerAuth("accessToken")
    @UseGuards(accessTokenGuard)
    @Post()
    createClub(@UserId() userId: number, @Body() createClubDto: CreateClubDto) {
        return this.clubService.createClub(createClubDto, userId);
    }

    //동아리 정보 수정
    //동아리 삭제
}
