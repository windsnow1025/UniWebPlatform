import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { Role } from '../common/enums/role.enum';
import { UserResDto } from './dto/user.res.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  public toUserDto(user: User) {
    const userDto: UserResDto = {
      id: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles,
      credit: user.credit,
    };
    return userDto;
  }

  private async hashPassword(password: string) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  find() {
    return this.usersRepository.find();
  }

  findOneById(id: number) {
    return this.usersRepository.findOneBy({ id });
  }

  findOneByUsername(username: string) {
    return this.usersRepository.findOneBy({ username });
  }

  findOneByEmail(email: string) {
    return this.usersRepository.findOneBy({ email });
  }

  async create(username: string, email: string, password: string) {
    if (
      (await this.findOneByUsername(username)) ||
      (await this.findOneByEmail(email))
    ) {
      throw new ConflictException();
    }

    const user = new User();
    user.username = username;
    user.email = email;
    user.password = await this.hashPassword(password);
    user.roles = [Role.User];

    return await this.usersRepository.save(user);
  }

  async updateUsername(id: number, username: string) {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.username === username) {
      return user;
    }

    if (await this.findOneByUsername(username)) {
      throw new ConflictException();
    }

    user.username = username;

    return await this.usersRepository.save(user);
  }

  async updateEmail(id: number, email: string) {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.email = email;

    return await this.usersRepository.save(user);
  }

  async updatePassword(id: number, password: string) {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.password = await this.hashPassword(password);

    return await this.usersRepository.save(user);
  }

  async updatePrivileges(username: string, roles: Role[], credit: number) {
    const user = await this.findOneByUsername(username);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.roles = roles;
    user.credit = credit;

    return await this.usersRepository.save(user);
  }

  remove(id: number) {
    return this.usersRepository.delete(id);
  }
}
