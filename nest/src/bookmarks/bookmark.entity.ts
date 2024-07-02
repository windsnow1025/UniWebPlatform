import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';

@Entity()
export class Bookmark extends BaseEntity {
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
