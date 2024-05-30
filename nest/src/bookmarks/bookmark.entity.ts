import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Bookmark {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'first_title',
  })
  firstTitle: string;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'second_title',
  })
  secondTitle: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  url: string;

  @Column({
    type: 'text',
  })
  comment: string;
}
