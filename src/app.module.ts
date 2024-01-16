import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigProjectModule } from "./config/config.module";
import { TypeormModule } from "./typeorm/typeorm.module";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { UserProfileModule } from "./user-profile/user-profile.module";
import { UserCalenderModule } from './user-calender/user-calender.module';

@Module({
    imports: [
        ConfigProjectModule,
        TypeormModule.forRoot(),
        AuthModule,
        UserModule,
        UserProfileModule,
        UserCalenderModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
