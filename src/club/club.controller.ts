import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import { ClubService } from "./club.service";
import { accessTokenGuard } from "../auth/guard/access-token.guard";
import { UserId } from "../auth/decorators/userId.decorator";
import { ApiBearerAuth } from "@nestjs/swagger";
import { CreateClubDto } from "./dto/createClub.dto";
import { UpdateClubDto } from "./dto/updateClub.dto";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { error } from "console";

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
    @UseInterceptors(FileInterceptor("file"))
    createClub(
        @UserId() userId: number,
        @Body() createClubDto: CreateClubDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.clubService.createClub(createClubDto, userId, file);
    }

    //동아리 정보 수정
    @ApiBearerAuth("accessToken")
    @UseGuards(accessTokenGuard)
    @Put("/:clubId")
    @UseInterceptors(FileInterceptor("file"))
    updateClub(
        @Param("clubId") id: string,
        @UserId() userId: number,
        @Body() updateClubDto: UpdateClubDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.clubService.updateClub(+id, userId, updateClubDto, file);
    }

    //동아리 삭제
    @ApiBearerAuth("accessToken")
    @UseGuards(accessTokenGuard)
    @Delete("/:clubId")
    deleteClub(@Param("clubId") id: string, @UserId() userId: number) {
        return this.clubService.deleteClub(+id, userId);
    }
}
