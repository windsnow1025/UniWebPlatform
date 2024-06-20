import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async update(currentUsername: string, newUsername: string, password: string) {
    const user = await this.findOneByUsername(currentUsername);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (currentUsername !== newUsername) {
      if (await this.findOneByUsername(newUsername)) {
        throw new ConflictException();
      }
      user.username = newUsername;
    }

    user.password = password;

    return await this.usersRepository.save(user);
  }

  remove(id: number) {
    return this.usersRepository.delete(id);
  }
}
