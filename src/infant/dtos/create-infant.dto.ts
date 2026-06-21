import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';

export class CreateInfantDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsDateString()
  birthDate: string;

  @IsString()
  @IsNotEmpty()
  avatarUrl: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;
}