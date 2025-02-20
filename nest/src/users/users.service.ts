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
import { PublicUserResDto } from './dto/public-user.res.dto';
import { PrivateUserResDto } from './dto/private-user.res.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  public toPublicUserDto(user: User) {
    const userDto: PublicUserResDto = {
      id: user.id,
      username: user.username,
      roles: user.roles,
      credit: user.credit,
    };
    return userDto;
  }

  public toPrivateUserDto(user: User) {
    const privateUserDto: PrivateUserResDto = {
      id: user.id,
      username: user.username,
      roles: user.roles,
      credit: user.credit,
      pin: user.pin,
    };
    return privateUserDto;
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

  async create(username: string, password: string) {
    if (await this.findOneByUsername(username)) {
      throw new ConflictException();
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);

    const user = new User();
    user.username = username;
    user.password = hash;
    user.roles = [Role.User];

    return await this.usersRepository.save(user);
  }

  async updateCredentials(currentUsername: string, newUsername: string, password: string) {
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

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);

    user.password = hash;

    return await this.usersRepository.save(user);
  }

  async updatePin(username: string, pin: number) {
    const user = await this.findOneByUsername(username);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.pin = pin;

    return await this.usersRepository.save(user);
  }

  async updateCredit(username: string, credit: number) {
    const user = await this.findOneByUsername(username);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.credit = credit;

    return await this.usersRepository.save(user);
  }

  remove(id: number) {
    return this.usersRepository.delete(id);
  }
}
