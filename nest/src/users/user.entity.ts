import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../common/enums/role.enum';

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
    type: 'simple-array',
  })
  roles: Role[];

  @Column({ type: 'float', default: 0 })
  credit: number;

  @Column({ type: 'int', default: 0 })
  pin: number;
}
