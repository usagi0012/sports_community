import { Controller, Get, Query, Req, Res, UseGuards } from "@nestjs/common";
import { NaverService } from "./naver.service";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";

interface IOAuthUser {
    user: {
        name: string;
        email: string;
        password: string;
    };
}

@ApiTags("네이버 소셜로그인")
@Controller("auth")
export class NaverController {
    constructor(
        private readonly naverService: NaverService,
        private readonly configService: ConfigService,
    ) {}

    @Get("naver/success")
    async naverOk(
        @Query("accessToken") accessToken: string,
        @Query("refreshToken") refreshToken: string,
        @Res() res: any,
    ) {
        res.cookie("accessToken", accessToken);
        res.cookie("refreshToken", refreshToken);
        //redirect할 본인 페이지 주소확인
        res.redirect(`${this.configService.get<string>("LOCAL")}/index.html`);
    }

    // 네이버 로그인할 event(button, 이미지 생성후 api를 통해 진행)
    @UseGuards(AuthGuard("naver"))
    @Get("naver")
    async naverLogin(): Promise<void> {}

    @UseGuards(AuthGuard("naver"))
    @Get("/naver/callback")
    async loginNaver(@Req() req: Request & IOAuthUser, @Res() res: Response) {
        this.naverService.OAuthLogin({ req, res });
    }
}
