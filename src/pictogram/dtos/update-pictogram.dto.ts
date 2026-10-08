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

export class UpdatePictogramDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  pictogramName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @Transform(({ value }) =>
    value === undefined ? undefined : value === true || value === 'true',
  )
  @IsBoolean()
  personal?: boolean;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  // @IsOptional()
  // @IsUUID()
  // userId?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  @ArrayUnique()
  infantId?: string[];
}
