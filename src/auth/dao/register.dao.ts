import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, MinLength } from "class-validator";

export class RegisterDao {
  @ApiProperty()
  @IsNotEmpty()
  email : string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  password : string;

  @ApiProperty()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  first_name: string;
  
  @ApiProperty()
  @IsNotEmpty()
  middle_name: string;
  
  @ApiProperty()
  @IsNotEmpty()
  last_name: string;
  
  @ApiProperty()
  @IsNotEmpty()
  birthdate: Date;

  @ApiProperty()
  @IsNotEmpty()
  city: string;
}