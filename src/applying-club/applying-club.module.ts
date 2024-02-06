import { Module } from "@nestjs/common";
import { ApplyingClubController } from "./applying-club.controller";
import { ApplyingClubService } from "./applying-club.service";
import { User } from "src/entity/user.entity";
import { Club } from "src/entity/club.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClubApplication } from "src/entity/club-application.entity";
import { AlarmserviceModule } from "src/alarm/alarm.module";
import { UserProfile } from "src/entity/user-profile.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Club, ClubApplication, UserProfile]),
        AlarmserviceModule,
    ],
    controllers: [ApplyingClubController],
    providers: [ApplyingClubService],
})
export class ApplyingClubModule {}
