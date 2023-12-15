import { ApiProperty } from "@nestjs/swagger";

export class BaseIdModel {
  @ApiProperty()
  id: Number
}