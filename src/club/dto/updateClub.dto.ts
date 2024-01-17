import { PartialType } from "@nestjs/swagger";
import { CreateClubDto } from "./createClub.dto";

export class UpdateClubDto extends PartialType(CreateClubDto) {}
