import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-naver-v2";

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, "naver") {
    constructor(private readonly configService: ConfigService) {
        super({
            clientID: configService.get<string>("NAVER_CLIENT_ID"),
            clientSecret: configService.get<string>("NAVER_CLIENT_SECRET"),
            callbackURL: `${configService.get<string>(
                "LOCAL",
            )}api/auth/naver/callback`,
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
    ) {
        return {
            name: profile.name,
            email: profile.email,
            nickname: profile.nickname,
        };
    }
}
