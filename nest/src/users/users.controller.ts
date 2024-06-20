import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { RequestWithUser } from '../auth/interfaces/request-with-user.interface';
import { AuthDto } from '../auth/dto/auth.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async find() {
    const users = await this.usersService.find();
    return users.map((user) => this.usersService.toUserDto(user));
  }

  @Get('/user')
  async findOne(@Request() req: RequestWithUser) {
    const id = req.user.sub;
    const user = await this.usersService.findOneById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Public()
  @Post('/user')
  create(@Body() authDto: AuthDto) {
    return this.usersService.create(authDto.username, authDto.password);
  }

  @Put('/user')
  update(@Request() req: RequestWithUser, @Body() authDto: AuthDto) {
    const currentUsername = req.user.username;
    return this.usersService.update(
      currentUsername,
      authDto.username,
      authDto.password,
    );
  }

  @Delete('/user')
  delete(@Request() req: RequestWithUser) {
    const id = req.user.sub;
    return this.usersService.remove(id);
  }
}
