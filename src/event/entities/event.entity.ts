import { Prisma, Event, $Enums } from "@prisma/client";
import { ImageModel } from "src/storage/entity/image.entity";

export class EventModel implements Event {
  status: $Enums.EventStatus;
  created_at: Date;
  updated_at: Date;
  banner_id: number;
  id: number;
  title: string;
  description: string;
  company_id: number;
  starts_at: Date;
  ends_at: Date;
  banner: ImageModel;
}
