import { PhrasePictogram } from 'src/phrase-pictogram/entities/phrase-pictogram.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';

@Entity()
export class Phrase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  user: User;

  @Column()
  text: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => PhrasePictogram, (phrasePictogram) => phrasePictogram.phrase)
  phrasePictograms: PhrasePictogram[];
}