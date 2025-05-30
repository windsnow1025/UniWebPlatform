import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../common/enums/role.enum';
import { BaseEntity } from '../common/entities/base.entity';

@Entity()
export class User extends BaseEntity {
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
    // unique: true,
    nullable: true,
  })
  email: string;

  @Column({
    type: 'boolean',
    default: false,
    name: 'email_verified',
  })
  emailVerified: boolean;

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

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  avatar: string;

  @Column({
    type: 'float',
    default: 0,
  })
  credit: number;
}
