import { IsEmail, IsString, MaxLength, MinLength, isEmail } from 'class-validator';

export class RegisterUserDto {
  @MinLength(3)
  @MaxLength(20)
  @IsString()
  name: string;

  @IsEmail()
  @IsString()
  email: string;

  @MinLength(6)
  @IsString()
  password: string;
}
