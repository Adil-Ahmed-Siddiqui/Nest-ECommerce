import { IsString, IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail()
  @IsString()
  email: string;
}
