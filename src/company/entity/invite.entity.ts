import { ApiProperty } from "@nestjs/swagger";
import { CompanyInvite } from "@prisma/client";

export class CompanyInviteModel implements CompanyInvite {
  @ApiProperty()
  uuid: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  valid_until: Date;
  
  @ApiProperty()
  enabled: boolean;

  @ApiProperty()
  company_id: number;
}