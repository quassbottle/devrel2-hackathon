import { $Enums, EventJoin } from "@prisma/client";

export class EventJoinModel implements EventJoin {
  id: number;
  created_at: Date;
  status: $Enums.ModerationStatus;
  user_id: number;
  event_id: number;
}