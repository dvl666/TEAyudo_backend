import {
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  categoryName?: string;

  @IsOptional()
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'El color debe tener el formato #RRGGBB',
  })
  color?: string;
}