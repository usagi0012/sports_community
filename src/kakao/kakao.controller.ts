import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { KakaoService } from "./kakao.service";
import { UserService } from "src/user/user.service";
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
@Controller("auth/kakao")
export class KakaoController {
    constructor(private readonly kakaoService: KakaoService) {}

    @UseGuards(AuthGuard("kakao"))
    @Get("/callback")
    async loginKakao(@Req() req: Request & IOAuthUser, @Res() res: Response) {
        console.log("user", req.user);
        this.kakaoService.OAuthLogin({ req, res });
    }
}
