import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "../auth.service";

@Injectable()
export class refreshTokenStrategy extends PassportStrategy(
    Strategy,
    "refreshToken",
) {
    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        private readonly authService: AuthService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
            ignoreExpiration: false,
            passReqToCallback: true,
        });
    }

    async validate(req: Request, payload: any) {
        try {
            const user = payload;

            return user;
        } catch (e) {
            if (e.message === "jwt expired") {
                const userId: number = payload.userId;
                await this.authService.logout(userId);
                throw new UnauthorizedException("refreshToken expired");
            }

            throw new UnauthorizedException("invalid accessToken");
        }
    }
}
