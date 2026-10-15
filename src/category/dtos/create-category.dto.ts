import {
  IsHexadecimal,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  categoryName: string;

  @IsNotEmpty()
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'El color debe tener el formato #RRGGBB',
  })
  color: string;
}