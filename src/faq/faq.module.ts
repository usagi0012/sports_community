import { Module } from "@nestjs/common";
import { FaqService } from "./faq.service";
import { FaqController } from "./faq.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/auth.module";
import { User } from "src/entity/user.entity";
import { Faq } from "../entity/faq.entity";
import { AwsModule } from "src/aws/aws.module";

@Module({
    imports: [TypeOrmModule.forFeature([User, Faq]), AwsModule, AuthModule],
    controllers: [FaqController],
    providers: [FaqService],
})
export class FaqModule {}
