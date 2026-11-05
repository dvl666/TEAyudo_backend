import { IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class SynthesizeSpeechDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  text: string;

  @IsString()
  @IsOptional()
  voiceId?: string; // Ej: 'Mia', 'Lupe', 'Andres', 'Lucia'

  @IsString()
  @IsOptional()
  @IsIn(['neural', 'standard'])
  engine?: 'neural' | 'standard';
}
