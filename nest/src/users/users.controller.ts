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
import { AuthReqDto } from '../auth/dto/auth.req.dto';
import { UsersService } from './users.service';
import { UserPinReqDto } from './dto/user.pin.req.dto';

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
    return this.usersService.toPrivateUserDto(user);
  }

  @Public()
  @Post('/user')
  async create(@Body() authDto: AuthReqDto) {
    const user = await this.usersService.create(
      authDto.username,
      authDto.password,
    );
    return this.usersService.toPrivateUserDto(user);
  }

  @Put('/user')
  async update(@Request() req: RequestWithUser, @Body() authDto: AuthReqDto) {
    const currentUsername = req.user.username;
    const user = await this.usersService.update(
      currentUsername,
      authDto.username,
      authDto.password,
    );
    return this.usersService.toPrivateUserDto(user);
  }

  @Put('/user/pin')
  async updatePin(
    @Request() req: RequestWithUser,
    @Body() userPinReqDto: UserPinReqDto,
  ) {
    const username = req.user.username;
    const user = await this.usersService.updatePin(username, userPinReqDto.pin);
    return this.usersService.toPrivateUserDto(user);
  }

  @Delete('/user')
  delete(@Request() req: RequestWithUser) {
    const id = req.user.sub;
    return this.usersService.remove(id);
  }
}
