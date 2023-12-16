import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class AnalyticsRecommendTagsDto {
  @ApiProperty()
  @IsNotEmpty()
  tags: string[]
}