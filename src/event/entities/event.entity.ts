import { ApiProperty } from "@nestjs/swagger";
import { Prisma, Event, $Enums } from "@prisma/client";
import { ImageModel } from "src/storage/entity/image.entity";

export class EventModel implements Event {
  @ApiProperty()
  status: $Enums.EventStatus;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty()
  banner_id: number;

  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  company_id: number;

  @ApiProperty()
  starts_at: Date;

  @ApiProperty()
  ends_at: Date;

  @ApiProperty()
  banner: ImageModel;
}
