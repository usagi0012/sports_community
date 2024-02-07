import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import { ClubService } from "./club.service";
import { accessTokenGuard } from "../auth/guard/access-token.guard";
import { UserId } from "../auth/decorators/userId.decorator";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CreateClubDto } from "./dto/createClub.dto";
import { UpdateClubDto } from "./dto/updateClub.dto";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { error } from "console";
import { cloudbuild } from "googleapis/build/src/apis/cloudbuild";
import { errorMonitor } from "events";
import { ExpelMemberDto } from "./dto/expelMember.dto";

@ApiTags("동아리")
@Controller("club")
export class ClubController {
    constructor(private readonly clubService: ClubService) {}

    //동아리 전체 조회
    @Get()
    getAllClubs(
        /* @Query("page") page: number */ @Query("sortBy") sortBy: string,
        @Query("region") region: number,
    ) {
        return this.clubService.getAllClubs(sortBy, region, 3);
    }

    // 동아리에 가입된 사람인지 확인
    @ApiBearerAuth("accessToken")
    @UseGuards(accessTokenGuard)
    @Get("/myClub")
    async hasClub(@UserId() userId: number) {
        try {
            console.log("1######");
            const result = await this.clubService.hasClub(userId);
            console.log("true 떠야함", result);
            return {
                statusCode: 200,
                message: "조회에 성공했습니다.",
                data: result,
            };
        } catch (error) {
            console.log(error);
            console.log("2######");

            return {
                statusCode: 400,
                error: error.message,
            };
        }
    }

    // 동아리 탈퇴
    @ApiBearerAuth("accessToken")
    @UseGuards(accessTokenGuard)
    @Put("/withdraw")
    withdrawClub(@UserId() userId: number) {
        try {
            console.log("user누구임", userId);
            const withdraw = this.clubService.withdrawClub(userId);

            return withdraw;
        } catch (error) {
            console.log(error);
        }
    }

    @ApiBearerAuth("accessToken")
    @UseGuards(accessTokenGuard)
    @Put("/expelMember")
    expelMember(
        @UserId() userId: number,
        @Body() expelMemeberDto: ExpelMemberDto,
    ) {
        try {
            return this.clubService.expelMember(userId, expelMemeberDto);
        } catch (error) {
            console.log(error);
        }
    }

    @ApiBearerAuth("accessToken")
    @UseGuards(accessTokenGuard)
    @Get("/myClubId")
    async getMyClubId(@UserId() userId: number) {
        console.log("백엔드 안들어옴?");
        const clubId = await this.clubService.getMyClubId(userId);

        return clubId;
    }

    // 동호회 장인지 체크
    @ApiBearerAuth("accessToken")
    @UseGuards(accessTokenGuard)
    @Get("/clubMaster")
    async isClubMaster(@UserId() userId: number) {
        try {
            const result = await this.clubService.isClubMaster(userId);

            return {
                statusCode: 200,
                message: "동호회장 조회에 성공했습니다.",
                data: result,
            };
        } catch (error) {
            console.log(error);

            return {
                statusCode: 400,
                message: "동호회장 조회에 실패했습니다.",
                error: error.message,
            };
        }
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
        console.log("여기 찍힘????");
        return this.clubService.createClub(createClubDto, userId, file);
    }

    // 동아리 멤버 불러오기
    @ApiBearerAuth("accessToken")
    @UseGuards(accessTokenGuard)
    @Get("/member/:clubId")
    getAllClubMember(@Param("clubId") clubId: number) {
        return this.clubService.getAllClubMember(clubId);
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

    // 내 동아리인지 확인
    @ApiBearerAuth("accessToken")
    @UseGuards(accessTokenGuard)
    @Get("/myClub/:clubId")
    async isMyClub(@UserId() userId: number, @Param("clubId") clubId: number) {
        try {
            const result = await this.clubService.isMyClub(userId, clubId);
            console.log("여기는 들어오는가");
            return {
                statusCode: 200,
                message: "조회에 성공했습니다.",
                data: result,
            };
        } catch (error) {
            console.log("여기 왜 안들어와.");
            console.log(error);
            console.log(error.message);
            return {
                statusCode: 400,
                message: "조회에 실패했습니다.",
                error: error.message,
            };
        }
    }
}
