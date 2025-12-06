import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { Role } from '../common/enums/role.enum';
import { UserResDto } from './dto/user.res.dto';
import { FirebaseService } from './firebase.service';
import { FirebaseAdminService } from './firebase-admin.service';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    private readonly firebaseService: FirebaseService,
    private readonly firebaseAdminService: FirebaseAdminService,
  ) {}

  public toUserDto(user: User) {
    const userDto: UserResDto = {
      id: user.id,
      username: user.username,
      email: user.email,
      emailVerified: user.emailVerified,
      roles: user.roles,
      avatar: user.avatar,
      credit: user.credit,
    };
    return userDto;
  }

  public async verifyPassword(user: User, password: string) {
    const hash = user.password;
    return await bcrypt.compare(password, hash);
  }

  private getUserCacheKey(id: number): string {
    return `user:${id}`;
  }

  private async hashPassword(password: string) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  find() {
    return this.usersRepository.find();
  }

  async findOneById(id: number) {
    if (!id) {
      throw new UnauthorizedException();
    }

    const cacheKey = this.getUserCacheKey(id);
    let user = await this.cacheManager.get<User>(cacheKey);
    if (user) {
      return user;
    }

    user = await this.usersRepository.findOneBy({ id });
    if (user) {
      await this.cacheManager.set(cacheKey, user, 3600000);
    }
    return user;
  }

  findOneByUsername(username: string) {
    if (!username) {
      throw new UnauthorizedException();
    }
    return this.usersRepository.findOneBy({ username });
  }

  findOneByEmail(email: string) {
    if (!email) {
      throw new UnauthorizedException();
    }
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

  async sendEmailVerification(email: string) {
    try {
      await this.firebaseAdminService.deleteUserByEmail(email);
    } catch {}
    await this.firebaseService.createFirebaseUser(email);
    await this.firebaseService.sendFirebaseEmailVerification(email);
  }

  async sendPasswordResetEmail(email: string) {
    try {
      await this.firebaseAdminService.deleteUserByEmail(email);
    } catch {}
    await this.firebaseService.createFirebaseUser(email);
    await this.firebaseService.sendFirebasePasswordResetEmail(email);
  }

  async updateEmailVerified(email: string) {
    const user = await this.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.emailVerified) {
      return user;
    }

    if (!(await this.firebaseService.checkEmailVerified(email))) {
      return user;
    }

    user.emailVerified = true;

    await this.cacheManager.del(this.getUserCacheKey(user.id));
    return await this.usersRepository.save(user);
  }

  async updateResetPassword(email: string, password: string) {
    const user = await this.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!(await this.firebaseService.verifyFirebaseUser(email, password))) {
      throw new UnauthorizedException('Invalid password');
    }

    return await this.updatePassword(user, password);
  }

  async updateEmail(id: number, email: string) {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.email === email) {
      return user;
    }

    if (await this.findOneByEmail(email)) {
      throw new ConflictException();
    }

    user.email = email;
    user.emailVerified = false;

    await this.cacheManager.del(this.getUserCacheKey(id));
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

    await this.cacheManager.del(this.getUserCacheKey(id));
    return await this.usersRepository.save(user);
  }

  async updatePassword(user: User, password: string) {
    user.password = await this.hashPassword(password);
    user.tokenVersion = user.tokenVersion + 1;

    await this.cacheManager.del(this.getUserCacheKey(user.id));
    return await this.usersRepository.save(user);
  }

  async updateAvatar(id: number, avatarUrl: string) {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.avatar = avatarUrl;

    await this.cacheManager.del(this.getUserCacheKey(id));
    return await this.usersRepository.save(user);
  }

  async updatePrivileges(
    username: string,
    emailVerified: boolean,
    roles: Role[],
    credit: number,
  ) {
    const user = await this.findOneByUsername(username);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.emailVerified = emailVerified;
    user.roles = roles;
    user.credit = credit;

    await this.cacheManager.del(this.getUserCacheKey(user.id));
    return await this.usersRepository.save(user);
  }

  async reduceCredit(id: number, amount: number) {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.credit -= amount;

    await this.cacheManager.del(this.getUserCacheKey(id));
    return await this.usersRepository.save(user);
  }

  async remove(id: number) {
    await this.cacheManager.del(this.getUserCacheKey(id));
    return await this.usersRepository.delete(id);
  }

  async deleteAllFirebaseUsers() {
    await this.firebaseAdminService.deleteAllUsers();
  }
}
