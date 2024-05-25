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
import { UsersService } from './users.service';
import { RequestWithUser } from '../auth/interfaces/request-with-user.interface';
import { Public } from '../common/decorators/public.decorator';
import { AuthDto } from '../auth/dto/auth.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('user')
  async findOne(@Request() req: RequestWithUser) {
    const id = req.user.sub;
    const user = await this.usersService.findOneById(id);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  @Public()
  @Post('user')
  create(@Body() authDto: AuthDto) {
    return this.usersService.create(authDto.username, authDto.password);
  }

  @Put('user')
  update(@Request() req: RequestWithUser, @Body() authDto: AuthDto) {
    const currentUsername = req.user.username;
    return this.usersService.update(
      currentUsername,
      authDto.username,
      authDto.password,
    );
  }

  @Delete('user')
  delete(@Request() req: RequestWithUser) {
    const id = req.user.sub;
    return this.usersService.remove(id);
  }
}
