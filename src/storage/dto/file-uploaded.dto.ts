import { ApiProperty } from "@nestjs/swagger";

export class FileUploadedDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  uploaded: boolean;

  @ApiProperty()
  size: number;

  @ApiProperty()
  url: string;
}