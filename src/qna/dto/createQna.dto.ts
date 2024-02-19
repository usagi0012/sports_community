import { PickType } from "@nestjs/swagger";
import { Qna } from "src/entity/qna.entity";

export class CreateQnaDto extends PickType(Qna, ["title", "description"]) {}
