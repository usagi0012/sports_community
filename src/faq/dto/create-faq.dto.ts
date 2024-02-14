import { PickType } from "@nestjs/swagger";
import { Faq } from "src/entity/faq.entity";

export class CreateFaqDto extends PickType(Faq, ["title", "description"]) {}
