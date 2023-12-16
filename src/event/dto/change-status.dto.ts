import { ApiProperty } from "@nestjs/swagger";
import { EventStatus } from "@prisma/client";
import { IsEnum, IsNotEmpty } from "class-validator";

export class EventChangeStatusDto {
  @ApiProperty({
    enum: ['in_progress', 'not_started', 'running', 'completed']
  })
  @IsEnum(EventStatus)
  @IsNotEmpty()
  status: EventStatus;
}