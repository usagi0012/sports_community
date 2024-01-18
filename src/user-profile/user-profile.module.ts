import { Module } from "@nestjs/common";
import { UserProfileService } from "./user-profile.service";
import { UserProfileController } from "./user-profile.controller";
import { UserProfile } from "../entity/user-profile.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/entity/user.entity";

@Module({
    imports: [TypeOrmModule.forFeature([UserProfile, User])],
    controllers: [UserProfileController],
    providers: [UserProfileService],
})
export class UserProfileModule {}
