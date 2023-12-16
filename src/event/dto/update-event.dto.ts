import { PartialType } from '@nestjs/swagger';
import { EventCreateDto } from './create-event.dto';

export class UpdateEventDto extends PartialType(EventCreateDto) {}
