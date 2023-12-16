import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class EmailNotifyDto {
  @ApiProperty()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    type: 'email'
  })
  @IsNotEmpty()
  producer_mail: string;
}