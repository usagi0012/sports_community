import { Module } from "@nestjs/common";
import { NoticeService } from "./notice.service";
import { NoticeController } from "./notice.controller";
import { Notice } from "src/entity/notice.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/entity/user.entity";
import { AuthModule } from "src/auth/auth.module";
import { AwsModule } from "src/aws/aws.module";

@Module({
    imports: [TypeOrmModule.forFeature([User, Notice]), AwsModule, AuthModule],
    controllers: [NoticeController],
    providers: [NoticeService],
})
export class NoticeModule {}
