import { IsInt, IsUUID, Max, Min } from 'class-validator';

export class CreateRoutineDto {
  @IsUUID()
  infantId: string;

  // 1 = lunes, 7 = domingo.
  @IsInt()
  @Min(1)
  @Max(7)
  dayOfWeek: number;
}
