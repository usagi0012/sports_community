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
            callbackURL: configService.get<string>("NAVER_CALLBACK_URL"),
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
    ) {
        // console.log("accessToken", accessToken);
        // console.log("refreshToken", refreshToken);
        // console.log("profile", profile);

        return {
            name: profile.name,
            email: profile.email,
            nickname: profile.nickname,
        };
    }
}