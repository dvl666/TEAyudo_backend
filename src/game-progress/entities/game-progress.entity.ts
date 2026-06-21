// game-progress.entity.ts
import { Category } from 'src/category/entities/category.entity';
import { Game } from 'src/game/entities/game.entity';
import { Infant } from 'src/infant/entities/infant.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class GameProgress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Infant, (infant) => infant.gameProgresses)
  infant: Infant;

  @ManyToOne(() => Game, (game) => game.progress)
  game: Game;

  @ManyToOne(() => Category, (category) => category.gameProgresses)
  categoryPlayed: Category;

  @Column({ type: 'timestamp' })
  gameDate: Date;

  @Column()
  correctAnswers: number;

  @Column()
  totalAnswers: number;
}