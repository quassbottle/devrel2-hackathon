import { IsNotEmpty } from "class-validator";

export class AnalyticsRecommendTagsDto {
  @IsNotEmpty()
  tags: string[]
}