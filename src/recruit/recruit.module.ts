import { Module } from "@nestjs/common";
import { RecruitService } from "./recruit.service";
import { RecruitController } from "./recruit.controller";
import { Recruit } from "../entity/recruit.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Match } from "src/entity/match.entity";
import { User } from "src/entity/user.entity";
@Module({
    imports: [TypeOrmModule.forFeature([Recruit, Match, User])],
    exports: [RecruitService],
    controllers: [RecruitController],
    providers: [RecruitService],
})
export class RecruitModule {}
