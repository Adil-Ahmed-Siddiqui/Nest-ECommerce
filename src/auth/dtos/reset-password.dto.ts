import { IsString, IsEmail, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail()
  @IsString()
  email: string;

  @MinLength(6)
  @IsString()
  password: string;

  @IsString()
  passwordToken: string;
}
