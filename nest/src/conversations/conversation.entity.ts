import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';
import { User } from '../users/user.entity';
import { Message } from './message.entity';
import { Label } from '../labels/label.entity';

@Entity()
export class Conversation extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  name: string;

  @Column({
    type: 'json',
  })
  messages: Message[];

  @Column({ type: 'boolean', default: false })
  isPublic: boolean;

  @ManyToOne(() => Label, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn()
  label: Label | null;

  @ManyToMany(() => User)
  @JoinTable()
  users: User[];
}
