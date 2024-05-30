import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Role } from '../common/enums/role.enum';
import { Conversation } from "../conversations/conversation.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  password: string;

  @Column({
    type: 'json',
    nullable: true,
  })
  roles: Role[];

  @Column({ type: 'float', default: 0 })
  credit: number;

  @Column({ type: 'int', default: 0 })
  pin: number;

  @OneToMany(() => Conversation, (conversation) => conversation.user)
  conversations: Conversation[];
}
