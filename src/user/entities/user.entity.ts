import { ApiProperty } from "@nestjs/swagger";
import { UserDetails } from "@prisma/client";
import { ImageModel } from "src/storage/entity/image.entity";

export class UserModel implements UserDetails {
  @ApiProperty()
  telegram: string;
  
  @ApiProperty()
  github_url: string;

  @ApiProperty()
  avatar: ImageModel;

  @ApiProperty()
  avatar_id: number;
  
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  first_name: string;

  @ApiProperty()
  middle_name: string;

  @ApiProperty()
  last_name: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  birthdate: Date;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  account_id: number;

  @ApiProperty()
  company_id: number;
}