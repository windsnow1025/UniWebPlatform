import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Markdown {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  title: string;

  @Column({
    type: 'text',
  })
  content: string;
}
