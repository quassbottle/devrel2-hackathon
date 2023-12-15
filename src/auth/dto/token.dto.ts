import { ApiParam, ApiProperty } from "@nestjs/swagger";

export class TokenDto {
  @ApiProperty()
  token: string;
}
