import { IsString, IsEmail } from 'class-validator';

export class VerifyEmailDto {
  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  verificationToken: string;
}
