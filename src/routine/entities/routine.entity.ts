import { on } from 'events';
import { Infant } from 'src/infant/entities/infant.entity';
import { Pictogram } from 'src/pictogram/entities/pictogram.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Routine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Infant, (infant) => infant.routines)
  infant: Infant;

  @ManyToOne(() => Pictogram, (pictogram) => pictogram.routines)
  pictogram: Pictogram;

  @OneToMany(() => Routine, (routine) => routine.pictogram)
  routines: Routine[];

  @Column({ type: 'time' })
  hour: string;

  @Column()
  dayOfWeek: number;

}