import { PartialType } from "@nestjs/swagger";
import { CreateQnaDto } from "./createQna.dto";

export class UpdateQnaDto extends PartialType(CreateQnaDto) {}
