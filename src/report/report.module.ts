import { Module } from "@nestjs/common";
import { ReportController } from "./report.controller";
import { ReportService } from "./report.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Report } from "../entity/report.entity";
import { User } from "../entity/user.entity";
import { Banlist } from "../entity/banlist.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Report, Banlist, User])],
    controllers: [ReportController],
    providers: [ReportService],
})
export class ReportModule {}
