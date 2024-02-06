import { Module } from "@nestjs/common";
import { ClubController } from "./club.controller";
import { ClubService } from "./club.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Club } from "../entity/club.entity";
import { UserModule } from "../user/user.module";
import { AwsModule } from "../aws/aws.module";
import { User } from "src/entity/user.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Club, User]), UserModule, AwsModule],
    controllers: [ClubController],
    providers: [ClubService],
})
export class ClubModule {}
