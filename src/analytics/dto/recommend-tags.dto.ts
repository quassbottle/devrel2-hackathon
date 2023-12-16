import { IsNotEmpty } from "class-validator";

export class AnalyticsRecommendTagsDto {
  @ApiProperty()
  @IsNotEmpty()
  tags: string[]
}