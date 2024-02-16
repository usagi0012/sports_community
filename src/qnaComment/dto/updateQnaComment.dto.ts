import { PartialType } from "@nestjs/swagger";
import { CreateQnaCommentDto } from "./createQnaComment.dto";

export class UpdateQnaCommentDto extends PartialType(CreateQnaCommentDto) {}
