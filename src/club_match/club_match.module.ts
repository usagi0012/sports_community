import { Module } from "@nestjs/common";
import { ClubMatchController } from "./club_match.controller";
import { ClubMatchService } from "./club_match.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "../user/user.module";
import { Club } from "../entity/club.entity";
import { ClubMatch } from "../entity/club_match.entity";
import { AlarmserviceModule } from "src/alarm/alarm.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Club]),
        UserModule,
        TypeOrmModule.forFeature([ClubMatch]),
        AlarmserviceModule,
    ],
    controllers: [ClubMatchController],
    providers: [ClubMatchService],
})
export class ClubMatchModule {}
