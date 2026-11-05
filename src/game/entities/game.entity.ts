import { GameProgress } from 'src/game-progress/entities/game-progress.entity';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => GameProgress, (progress) => progress.game)
  progress: GameProgress[];
}