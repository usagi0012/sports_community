import { MatchService } from "./match.service";
import { Module } from "@nestjs/common";
import { MatchController } from "./match.controller";
import { Match } from "../entity/match.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Recruit } from "../entity/recruit.entity";
import { User } from "../entity/user.entity";
@Module({
    imports: [TypeOrmModule.forFeature([Recruit, Match, User])],
    providers: [MatchService],
    controllers: [MatchController],
})
export class MatchModule {}
