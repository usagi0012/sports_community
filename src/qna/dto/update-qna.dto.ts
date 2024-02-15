import { PartialType } from '@nestjs/swagger';
import { CreateQnaDto } from './create-qna.dto';

export class UpdateQnaDto extends PartialType(CreateQnaDto) {}
