import { PartialType } from "@nestjs/swagger";
import { CreateFaqDto } from "./createFaq.dto";

export class UpdateFaqDto extends PartialType(CreateFaqDto) {}
