import { IsString, IsEmail, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  @IsString()
  email: string;

  // @MinLength(6)
  @IsString()
  password: string;
}
