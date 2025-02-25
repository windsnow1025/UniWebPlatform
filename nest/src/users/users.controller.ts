import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { RequestWithUser } from '../auth/interfaces/request-with-user.interface';
import { UsersService } from './users.service';
import { UserPrivilegesReqDto } from './dto/user.privileges.req.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import {
  UserPasswordReqDto,
  UserReqDto,
  UserUsernameReqDto,
} from './dto/user.req.dto';

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
    return this.usersService.toUserDto(user);
  }

  @Public()
  @Post('/user')
  async create(@Body() authDto: UserReqDto) {
    const user = await this.usersService.create(
      authDto.username,
      authDto.email,
      authDto.password,
    );
    return this.usersService.toUserDto(user);
  }

  @Put('/user/username')
  async updateUsername(
    @Request() req: RequestWithUser,
    @Body() authDto: UserUsernameReqDto,
  ) {
    const id = req.user.sub;
    const user = await this.usersService.updateUsername(id, authDto.username);
    return this.usersService.toUserDto(user);
  }

  @Put('/user/password')
  async updatePassword(
    @Request() req: RequestWithUser,
    @Body() authDto: UserPasswordReqDto,
  ) {
    const id = req.user.sub;
    const user = await this.usersService.updatePassword(id, authDto.password);
    return this.usersService.toUserDto(user);
  }

  @Put('/user/privileges')
  @Roles([Role.Admin])
  async updatePrivileges(@Body() userPrivilegesReqDto: UserPrivilegesReqDto) {
    const user = await this.usersService.updatePrivileges(
      userPrivilegesReqDto.username,
      userPrivilegesReqDto.roles,
      userPrivilegesReqDto.credit,
    );
    return this.usersService.toUserDto(user);
  }

  @Delete('/user')
  delete(@Request() req: RequestWithUser) {
    const id = req.user.sub;
    return this.usersService.remove(id);
  }

  @Delete('/user/:id')
  @Roles([Role.Admin])
  deleteById(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
