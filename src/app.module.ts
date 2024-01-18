import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigProjectModule } from "./config/config.module";
import { TypeormModule } from "./typeorm/typeorm.module";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { PersonalassessmenttagModule } from "./personalassessmenttag/personalassessmenttag.module";
import { ClubassessmenttagModule } from './clubassessmenttag/clubassessmenttag.module';

@Module({
    imports: [
        ConfigProjectModule,
        TypeormModule.forRoot(),
        AuthModule,
        UserModule,
        PersonalassessmenttagModule,
        ClubassessmenttagModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
