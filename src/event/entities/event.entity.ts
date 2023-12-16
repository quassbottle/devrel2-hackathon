import { Prisma, Event } from "@prisma/client";
import { ImageModel } from "src/storage/entity/image.entity";

export class EventModel implements Event {
  id: number;
  title: string;
  description: string;
  company_id: number;
  banner: ImageModel;
}
