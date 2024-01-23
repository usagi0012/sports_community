import { Module } from "@nestjs/common";
import { ClubController } from "./club.controller";
import { ClubService } from "./club.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Club } from "../entity/club.entity";
import { UserModule } from "../user/user.module";
import { AwsModule } from "../aws/aws.module";

@Module({
    imports: [TypeOrmModule.forFeature([Club]), UserModule, AwsModule],
    controllers: [ClubController],
    providers: [ClubService],
})
export class ClubModule {}
