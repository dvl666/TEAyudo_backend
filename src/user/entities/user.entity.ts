import { Infant } from "src/infant/entities/infant.entity";
import { Pictogram } from "src/pictogram/entities/pictogram.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  administrativePin: string;

  @OneToMany(() => Pictogram, (pictogram) => pictogram.user)
  pictograms: Pictogram[];

  @ManyToMany(() => Infant, (infant) => infant.users)
  @JoinTable()
  infants: Infant[];
}