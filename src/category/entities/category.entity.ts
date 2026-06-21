import { GameProgress } from 'src/game-progress/entities/game-progress.entity';
import { Pictogram } from 'src/pictogram/entities/pictogram.entity';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  categoryName: string;

  @OneToMany(() => Pictogram, (pictogram) => pictogram.category)
  pictograms: Pictogram[];

  @OneToMany(() => GameProgress, (gameProgress) => gameProgress.categoryPlayed)
  gameProgresses: GameProgress[];
}