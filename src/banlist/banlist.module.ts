import { Module } from "@nestjs/common";
import { BanlistController } from "./banlist.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Banlist } from "../entity/banlist.entity";
import { Report } from "../entity/report.entity";
import { User } from "../entity/user.entity";
import { BanlistService } from "./banlist.service";
@Module({
    imports: [TypeOrmModule.forFeature([Banlist, Report, User])],
    providers: [BanlistService],
    controllers: [BanlistController],
})
export class BanlistModule {}
