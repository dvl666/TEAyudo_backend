import { Pictogram } from 'src/pictogram/entities/pictogram.entity';
import {
  Check,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoutineStage } from '../enums/routine-stage.enum';
import { Routine } from './routine.entity';

@Entity()
@Check('CHK_routine_activity_position', '"position" >= 0')
export class RoutineActivity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Routine, (routine) => routine.activities, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  routine: Routine;

  @ManyToOne(() => Pictogram, (pictogram) => pictogram.routineActivities, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  pictogram: Pictogram;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: RoutineStage })
  stage: RoutineStage;

  @Column({ type: 'int' })
  position: number;
}
