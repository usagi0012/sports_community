import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-kakao";

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, "kakao") {
    constructor(private readonly configService: ConfigService) {
        super({
            clientID: configService.get<string>("KAKAO_CLIENT_ID"),
            clientSecret: configService.get<string>("KAKAO_CLIENT_SECRET"),
            callbackURL: configService.get<string>("KAKAO_CALLBACK_URL"),
            scope: ["account_email", "profile_nickname"],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
    ) {
        // console.log("accessToken", accessToken);
        // console.log("refreshToken", refreshToken);
        // console.log(profile);

        return {
            accessToken,
            refreshToken,
            email: profile._json.kakao_account.email,
            nickname: profile.displayName,
        };
    }
}
