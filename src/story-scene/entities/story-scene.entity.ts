import { Game } from 'src/game/entities/game.entity';
import { Pictogram } from 'src/pictogram/entities/pictogram.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class StoryScene {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Game, (game) => game.storyScenes)
  game: Game;

  @ManyToOne(() => Pictogram, (pictogram) => pictogram.storyScenes)
  correctPictogram: Pictogram;

  @Column()
  title: string;

  @Column()
  imageUrl: string;
}