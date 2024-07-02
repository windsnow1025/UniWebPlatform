import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';

@Entity()
export class Markdown extends BaseEntity {
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
