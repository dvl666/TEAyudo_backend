import { Infant } from 'src/infant/entities/infant.entity';
import {
  Check,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { RoutineActivity } from './routine-activity.entity';

@Entity()
@Unique('UQ_routine_infant_day', ['infant', 'dayOfWeek'])
@Check('CHK_routine_day', '"dayOfWeek" BETWEEN 1 AND 7')
export class Routine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Infant, (infant) => infant.routines, { nullable: false })
  infant: Infant;

  // 1 = lunes, 7 = domingo.
  @Column({ type: 'int' })
  dayOfWeek: number;

  @OneToMany(() => RoutineActivity, (activity) => activity.routine)
  activities: RoutineActivity[];
}
