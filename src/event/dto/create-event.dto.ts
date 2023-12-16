import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class EventCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  banner_id: number;

  @ApiProperty()
  @IsNotEmpty()
  starts_at: Date;

  @ApiPropertyOptional()
  ends_at: Date;
}
