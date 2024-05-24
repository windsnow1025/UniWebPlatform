import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findOneById(id: number) {
    return this.usersRepository.findOneBy({ id });
  }

  findOneByUsername(username: string) {
    return this.usersRepository.findOneBy({ username });
  }

  async create(username: string, password: string) {
    if (await this.findOneByUsername(username)) {
      throw new ConflictException();
    }

    const user = new User();
    user.username = username;
    user.password = password;
    user.roles = [Role.User];

    return await this.usersRepository.save(user);
  }

  async remove(id: number) {
    return await this.usersRepository.delete(id);
  }
}
