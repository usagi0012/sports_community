import { Module, forwardRef } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../entity/user.entity";
import { AuthModule } from "../auth/auth.module";
import { ClubApplication } from "src/entity/club-application.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([User, ClubApplication]),
        forwardRef(() => AuthModule),
    ],
    exports: [UserService, TypeOrmModule.forFeature([User, ClubApplication])],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
