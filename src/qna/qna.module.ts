import { Module } from "@nestjs/common";
import { QnaService } from "./qna.service";
import { QnaController } from "./qna.controller";
import { User } from "src/entity/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Qna } from "../entity/qna.entity";
import { AwsModule } from "src/aws/aws.module";
import { AuthModule } from "src/auth/auth.module";
import { QnaComment } from "src/entity/qnaComment.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([User, QnaComment, Qna]),
        AwsModule,
        AuthModule,
    ],
    controllers: [QnaController],
    providers: [QnaService],
})
export class QnaModule {}
