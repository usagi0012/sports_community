import { Controller, Get, Query, Req, Res, UseGuards } from "@nestjs/common";
import { KakaoService } from "./kakao.service";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags } from "@nestjs/swagger";

interface IOAuthUser {
    user: {
        name: string;
        email: string;
        password: string;
    };
}

@ApiTags("카카오 소셜로그인")
@Controller("auth")
export class KakaoController {
    constructor(private readonly kakaoService: KakaoService) {}

    @Get("kakao/success")
    async kakaoLoginOk(
        @Query("accessToken") accessToken: string,
        @Query("refreshToken") refreshToken: string,
        @Res() res: any,
    ) {
        res.cookie("accessToken", accessToken);
        res.cookie("refreshToken", refreshToken);
        //redirect할 본인 페이지 주소확인
        res.redirect("http://localhost:8001/index.html");
    }

    // 카카오 로그인할 event(button, 이미지 생성후 api를 통해 진행)
    @UseGuards(AuthGuard("kakao"))
    @Get("kakao")
    async kakaoLogin(): Promise<void> {}

    @UseGuards(AuthGuard("kakao"))
    @Get("/kakao/callback")
    async loginKakao(@Req() req: Request & IOAuthUser, @Res() res: Response) {
        this.kakaoService.OAuthLogin({ req, res });
    }
}
