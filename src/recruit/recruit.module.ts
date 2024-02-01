import { Module } from "@nestjs/common";
import { RecruitService } from "./recruit.service";
import { RecruitController } from "./recruit.controller";
import { Recruit } from "../entity/recruit.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Match } from "../entity/match.entity";
import { User } from "../entity/user.entity";
import { AlarmserviceModule } from "src/alarm/alarm.module";
@Module({
    imports: [
        TypeOrmModule.forFeature([Recruit, Match, User]),
        AlarmserviceModule,
    ],
    exports: [RecruitService],
    controllers: [RecruitController],
    providers: [RecruitService],
})
export class RecruitModule {}
