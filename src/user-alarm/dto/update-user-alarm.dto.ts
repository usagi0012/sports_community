import { PartialType } from '@nestjs/mapped-types';
import { CreateUserAlarmDto } from './create-user-alarm.dto';

export class UpdateUserAlarmDto extends PartialType(CreateUserAlarmDto) {}
