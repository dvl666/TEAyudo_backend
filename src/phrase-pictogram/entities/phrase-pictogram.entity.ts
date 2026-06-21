import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Phrase } from 'src/phrase/entities/phrase.entity';
import { Pictogram } from 'src/pictogram/entities/pictogram.entity';

@Entity()
export class PhrasePictogram {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Phrase, (phrase) => phrase.phrasePictograms)
  phrase: Phrase;

  @ManyToOne(() => Pictogram, (pictogram) => pictogram.phrasePictograms)
  pictogram: Pictogram;

  @Column()
  order: number;
}