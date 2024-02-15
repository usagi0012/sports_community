import { Module } from "@nestjs/common";
import { FaqService } from "./faq.service";
import { FaqController } from "./faq.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/auth.module";
import { User } from "src/entity/user.entity";
import { Faq } from "../entity/faq.entity";

@Module({
    imports: [TypeOrmModule.forFeature([User, Faq]), AuthModule],
    controllers: [FaqController],
    providers: [FaqService],
})
export class FaqModule {}
