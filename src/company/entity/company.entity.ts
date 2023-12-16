import { ApiProperty } from "@nestjs/swagger";
import { $Enums, CompanyDetails } from "@prisma/client";
import { ImageModel } from "../../storage/entity/image.entity";

export class CompanyModel implements CompanyDetails {
  @ApiProperty()
  avatar: ImageModel;

  @ApiProperty()
  avatar_id: number;

  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  status: $Enums.ModerationStatus;

  @ApiProperty()
  account_id: number;
}