import { ApiProperty } from "@nestjs/swagger";
import { $Enums, Account } from "@prisma/client";

export class AccountModel implements Account {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  role: $Enums.Role;
}