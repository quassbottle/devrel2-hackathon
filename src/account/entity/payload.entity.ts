import { ApiProperty } from "@nestjs/swagger";
import { Account } from "@prisma/client";

export class TokenPayloadModel {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  user_id: number;

  @ApiProperty()
  company_id: number;
}