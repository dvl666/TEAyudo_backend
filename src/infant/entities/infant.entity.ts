import { GameProgress } from "src/game-progress/entities/game-progress.entity";
import { Pictogram } from "src/pictogram/entities/pictogram.entity";
import { Routine } from "src/routine/entities/routine.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Infant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  birthDate: Date;

  @Column()
  avatarUrl: string;

  @OneToMany(() => Routine, (routine) => routine.infant)
  routines: Routine[];

  @OneToMany(() => GameProgress, (gameProgress) => gameProgress.infant)
  gameProgresses: GameProgress[];

  @OneToMany(() => Pictogram, (pictogram) => pictogram.infant)
  pictograms: Pictogram[];

  @ManyToMany(() => User, (user) => user.infants)
  users: User[];
}