import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  name: string;
}
