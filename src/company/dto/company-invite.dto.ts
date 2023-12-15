import { IsNotEmpty, IsUUID } from "class-validator";

export class CompanyInviteDto {
  @IsNotEmpty()
  @IsUUID()
  uuid: string;
}