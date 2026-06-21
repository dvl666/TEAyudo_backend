import { GameProgress } from 'src/game-progress/entities/game-progress.entity';
import { StoryScene } from 'src/story-scene/entities/story-scene.entity';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @OneToMany(() => GameProgress, (progress) => progress.game)
  progress: GameProgress[];

  @OneToMany(() => StoryScene, (scene) => scene.game)
  storyScenes: StoryScene[];
}