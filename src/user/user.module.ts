import { Module, forwardRef } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../entity/user.entity";
import { AuthModule } from "../auth/auth.module";
import { ClubApplication } from "src/entity/club-application.entity";
import { Report } from "src/entity/report.entity";
import { Banlist } from "src/entity/banlist.entity";
@Module({
    imports: [
        TypeOrmModule.forFeature([User, ClubApplication, Report, Banlist]),
        forwardRef(() => AuthModule),
    ],
    exports: [UserService, TypeOrmModule.forFeature([User, ClubApplication])],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
