import { ApiProperty } from "@nestjs/swagger";
import { Image } from "@prisma/client";

export class ImageModel implements Image {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  size: number;
}