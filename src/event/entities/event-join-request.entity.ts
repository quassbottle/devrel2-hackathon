import { ApiProperty } from "@nestjs/swagger";
import { $Enums, EventJoin } from "@prisma/client";

export class EventJoinModel implements EventJoin {
  @ApiProperty()
  id: number;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  status: $Enums.ModerationStatus;

  @ApiProperty()
  user_id: number;

  @ApiProperty()
  event_id: number;
}