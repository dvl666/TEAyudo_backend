import { Transform } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreatePictogramDto {
  @IsString()
  @IsNotEmpty()
  pictogramName: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  @IsOptional()
  personal = false;

  @IsUUID()
  categoryId: string;

  @IsUUID()
  userId: string;

  @IsArray()
  @IsUUID('4', { each: true })
  @ArrayUnique()
  infantId: string[];
}
