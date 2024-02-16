import { PickType } from "@nestjs/swagger";
import { Notice } from "src/entity/notice.entity";

export class CreateNoticeDto extends PickType(Notice, [
    "title",
    "description",
]) {}
