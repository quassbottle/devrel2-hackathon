import { ApiProperty } from "@nestjs/swagger";

export class CompanyTgBotTokenDto {
  @ApiProperty()
  token: string;
}