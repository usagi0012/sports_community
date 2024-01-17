import { Module } from "@nestjs/common";
import { ApplyingClubController } from "./applying-club.controller";
import { ApplyingClubService } from "./applying-club.service";
import { User } from "src/entity/user.entity";
import { Club } from "src/entity/club.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClubApplication } from "src/entity/club-application.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Club, ClubApplication]),
        // auth 관련해서 무슨 모듈 가져와야하지
    ],
    controllers: [ApplyingClubController],
    providers: [ApplyingClubService],
})
export class ApplyingClubModule {}
