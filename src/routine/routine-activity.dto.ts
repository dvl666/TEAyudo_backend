import { IsEnum, IsInt, IsString, IsUUID, Matches, Min } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { RoutineStage } from './enums/routine-stage.enum';

export class CreateRoutineActivityDto {
  @IsString()
  @Matches(/\S/, { message: 'name must not be blank' })
  name: string;

  @IsUUID()
  pictogramId: string;

  @IsEnum(RoutineStage)
  stage: RoutineStage;

  @IsInt()
  @Min(0)
  position: number;
}

export class UpdateRoutineActivityDto extends PartialType(
  CreateRoutineActivityDto,
  { skipNullProperties: false },
) {}
