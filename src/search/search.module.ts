import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SearchService } from "./search.service";
import { SearchController } from "./search.controller";
import { Recruit } from "../entity/recruit.entity";
import { Club } from "../entity/club.entity";
import { Place } from "../entity/place.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Recruit, Club, Place])],
    controllers: [SearchController],
    providers: [SearchService],
})
export class SearchModule {}
