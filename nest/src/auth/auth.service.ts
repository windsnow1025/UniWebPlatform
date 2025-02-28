import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private async getToken(user: User | null, password: string) {
    if (!user) {
      throw new UnauthorizedException();
    }

    if (!(await this.usersService.verifyPassword(user, password))) {
      throw new UnauthorizedException();
    }

    const payload: JwtPayload = {
      sub: user.id.toString(),
      username: user.username,
      emailVerified: user.emailVerified,
      roles: user.roles,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async getTokenByEmail(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);
    return await this.getToken(user, password);
  }

  async getTokenByUsername(username: string, password: string) {
    const user = await this.usersService.findOneByUsername(username);
    return await this.getToken(user, password);
  }
}
