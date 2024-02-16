import { Module } from "@nestjs/common";
import { QnaCommentController } from "./qnaComment.controller";
import { QnaCommentService } from "./qnaComment.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/entity/user.entity";
import { QnaComment } from "src/entity/qnaComment.entity";
import { AuthModule } from "src/auth/auth.module";
import { Qna } from "src/entity/qna.entity";

@Module({
    imports: [TypeOrmModule.forFeature([User, QnaComment, Qna]), AuthModule],
    controllers: [QnaCommentController],
    providers: [QnaCommentService],
})
export class QnaCommentModule {}
