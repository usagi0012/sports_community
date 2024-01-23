import { Module } from "@nestjs/common";
import { PlaceController } from "./place.controller";
import { PlaceService } from "./place.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Place } from "../entity/place.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Place])],
    controllers: [PlaceController],
    providers: [PlaceService],
})
export class PlaceModule {}
