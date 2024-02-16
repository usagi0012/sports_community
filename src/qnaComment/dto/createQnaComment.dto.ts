import { PickType } from "@nestjs/swagger";
import { QnaComment } from "src/entity/qnaComment.entity";

export class CreateQnaCommentDto extends PickType(QnaComment, ["comment"]) {}
