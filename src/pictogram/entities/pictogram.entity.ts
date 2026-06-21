import { Category } from 'src/category/entities/category.entity';
import { Infant } from 'src/infant/entities/infant.entity';
import { PhrasePictogram } from 'src/phrase-pictogram/entities/phrase-pictogram.entity';
import { Routine } from 'src/routine/entities/routine.entity';
import { StoryScene } from 'src/story-scene/entities/story-scene.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Pictogram {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  pictogramName: string;

  @Column({ default: false })
  personal: boolean;

  @Column()
  description: string;

  @Column()
  pictoImageUrl: string;

  @ManyToOne(() => Category, (category) => category.pictograms)
  category: Category;

  @OneToMany(() => Routine, (routine) => routine.pictogram)
  routines: Routine[];

  @ManyToOne(() => User, (user) => user.pictograms)
  user: User;

  @ManyToOne(() => Infant, (infant) => infant.pictograms)
  infant: Infant;

  @OneToMany(() => PhrasePictogram, (phrasePictogram) => phrasePictogram.pictogram)
  phrasePictograms: PhrasePictogram[];

  @OneToMany(() => StoryScene, (storyScene) => storyScene.correctPictogram)
  storyScenes: StoryScene[];
}