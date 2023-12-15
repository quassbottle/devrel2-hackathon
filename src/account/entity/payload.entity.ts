import { ApiProperty } from "@nestjs/swagger";

export class TokenPayloadModel {
  @ApiProperty()
  id: Number;

  @ApiProperty()
  email: String;

  @ApiProperty()
  role: String;
}