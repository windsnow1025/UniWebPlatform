import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async getToken(username: string, password: string) {
    const user = await this.usersService.findOneByUsername(username);
    if (user?.password !== password) {
      throw new UnauthorizedException();
    }
    const payload: JwtPayload = {
      sub: user.id.toString(),
      username: user.username,
      roles: user.roles,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
