import { ApiProperty } from "@nestjs/swagger";
import { ImageModel } from "src/storage/entity/image.entity";

export class UserUpdateDto {
  @ApiProperty()
  avatar_id: number;

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
  github_url: string;
}