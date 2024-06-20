import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { ConversationMessage } from './interfaces/conversation-message.interface';

@Entity()
export class Conversation {
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
  messages: ConversationMessage[];

  @ManyToMany(() => User)
  @JoinTable()
  users: User[];
}
