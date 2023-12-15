import { ApiParam, ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Length, MinLength } from "class-validator";

export class ChangePasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}