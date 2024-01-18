import { Module } from "@nestjs/common";
import { ClubMatchController } from "./club_match.controller";
import { ClubMatchService } from "./club_match.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "../user/user.module";
import { Club } from "../entity/club.entity";
import { ClubMatch } from "../entity/club_match.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Club]),
        UserModule,
        TypeOrmModule.forFeature([ClubMatch]),
    ],
    controllers: [ClubMatchController],
    providers: [ClubMatchService],
})
export class ClubMatchModule {}
