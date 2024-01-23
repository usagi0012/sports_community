import {
    Body,
    Controller,
    Post,
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

@ApiTags("인증")
@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("signup")
    signup(@Body() singupUserDto: SignupUserDto) {
        return this.authService.signup(singupUserDto);
    }
    //관리자로 가입하기
    @Post("signup/adimn")
    admin_signup(@Body() signupAdminDto: SignupAdminDto) {
        return this.authService.signup(signupAdminDto);
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

    @ApiBearerAuth("accessToken")
    @UseGuards(accessTokenGuard)
    @Post("logout")
    logout(@Req() req: Request) {
        const userId: number = (req.user as any).userId;

        if (!userId) {
            throw new UnauthorizedException("로그인 오류입니다.");
        }

        return this.authService.logout(userId);
    }
}
