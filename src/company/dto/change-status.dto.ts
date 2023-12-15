import { ApiProperty } from "@nestjs/swagger";
import { ModerationStatus } from "@prisma/client";
import { IsEnum, IsNotEmpty } from "class-validator";

export class CompanyChangeStatusDto {
  @ApiProperty({
    enum: ['todo', 'accepted', 'declined']
  })
  @IsEnum(ModerationStatus)
  @IsNotEmpty()
  status: ModerationStatus;
}