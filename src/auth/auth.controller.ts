import {
    Body,
    Controller,
    Get,
    Post,
    Query,
    Redirect,
    Req,
    UnauthorizedException,
    UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "./dto/login-user.dto";
import { SignupUserDto } from "./dto/signup-user.dto";
import { SignupAdminDto } from "./dto/admin-signup.dto";
import { accessTokenGuard } from "./guard/access-token.guard";
import { refreshTokenGuard } from "./guard/refresh-token.guard";
import { Request } from "express";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { UserId } from "./decorators/userId.decorator";

@ApiTags("인증")
@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("signup")
    signup(@Body() singupUserDto: SignupUserDto) {
        return this.authService.signup(singupUserDto);
    }

    @Post("login")
    login(@Body() loginUserDto: LoginUserDto) {
        return this.authService.login(loginUserDto);
    }

    @ApiBearerAuth("refreshToken")
    @UseGuards(refreshTokenGuard)
    @Post("refresh")
    refresh(@Req() req: Request) {
        const userId: number = (req.user as any).userId;

        if (!userId) {
            throw new UnauthorizedException("로그인 오류입니다.");
        }

        return this.authService.refresh(userId);
    }

    //인증 링크 토큰가져오기
    @Get("verify")
    @Redirect() // Redirect decorator를 사용하여 클라이언트를 리다이렉트합니다.
    async verify(@Query("token") token: string) {
        // verify 메서드를 호출하여 인증 코드를 확인하고 인증이 완료되면 리다이렉트할 URL을 반환합니다.
        const redirectUrl = await this.authService.verify(token);
        return { url: redirectUrl };
    }

    //비밀번호 까먹은 회원 랜덤 비밀번호 메일로 보내고 리셋하기
    @Post("resetPassword")
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return this.authService.resetPassword(resetPasswordDto.email);
    }

    @ApiBearerAuth("accessToken")
    @UseGuards(accessTokenGuard)
    @Post("logout")
    logout(@UserId() userId: number) {
        if (!userId) {
            throw new UnauthorizedException("로그인 오류입니다.");
        }

        return this.authService.logout(userId);
    }
}
