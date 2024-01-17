import { Module } from "@nestjs/common";
import { ClubController } from "./club.controller";
import { ClubService } from "./club.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Club } from "src/entity/club.entity";
import { UserModule } from "src/user/user.module";

@Module({
    imports: [TypeOrmModule.forFeature([Club]), UserModule],
    controllers: [ClubController],
    providers: [ClubService],
})
export class ClubModule {}
