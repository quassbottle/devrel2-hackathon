import { ApiProperty } from "@nestjs/swagger";
import { ModerationStatus } from "@prisma/client";
import { IsEnum, IsNotEmpty } from "class-validator";

export class EventJoinStatusDto {
  @ApiProperty({
    enum: ['todo', 'accepted', 'declined']
  })
  @IsEnum(ModerationStatus)
  @IsNotEmpty()
  status: ModerationStatus;
}