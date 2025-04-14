import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { RequestWithUser } from '../auth/interfaces/request-with-user.interface';
import { UsersService } from './users.service';
import { UserPrivilegesReqDto } from './dto/user.privileges.req.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { AllowUnverifiedEmail } from '../common/decorators/allow-unverified-email.decorator';
import { Role } from '../common/enums/role.enum';
import {
  UserAvatarReqDto,
  UserEmailReqDto,
  UserEmailVerificationReqDto,
  UserPasswordReqDto,
  UserReqDto,
  UserUsernameReqDto,
  ReduceCreditReqDto,
} from './dto/user.req.dto';
import { UserResDto } from './dto/user.res.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async find() {
    const users = await this.usersService.find();
    return users.map((user) => this.usersService.toUserDto(user));
  }

  @AllowUnverifiedEmail()
  @Get('/user')
  async findOne(@Request() req: RequestWithUser): Promise<UserResDto> {
    return req.user;
  }

  @Public()
  @Post('/user')
  async create(@Body() userReqDto: UserReqDto) {
    const user = await this.usersService.create(
      userReqDto.username,
      userReqDto.email,
      userReqDto.password,
    );
    return this.usersService.toUserDto(user);
  }

  @AllowUnverifiedEmail()
  @Post('/user/email-verification')
  async sendEmailVerification(
    @Body() userEmailReqDto: UserEmailVerificationReqDto,
  ) {
    await this.usersService.sendEmailVerification(
      userEmailReqDto.email,
      userEmailReqDto.password,
    );
  }

  @AllowUnverifiedEmail()
  @Put('/user/email-verified')
  async updateEmailVerified(@Body() userReqDto: UserEmailVerificationReqDto) {
    const user = await this.usersService.updateEmailVerified(
      userReqDto.email,
      userReqDto.password,
    );
    return this.usersService.toUserDto(user);
  }

  @AllowUnverifiedEmail()
  @Put('/user/email')
  async updateEmail(
    @Request() req: RequestWithUser,
    @Body() userEmailReqDto: UserEmailReqDto,
  ): Promise<UserResDto> {
    const id = req.user.id;
    const user = await this.usersService.updateEmail(id, userEmailReqDto.email);
    return this.usersService.toUserDto(user);
  }

  @Put('/user/username')
  async updateUsername(
    @Request() req: RequestWithUser,
    @Body() userUsernameReqDto: UserUsernameReqDto,
  ): Promise<UserResDto> {
    const id = req.user.id;
    const user = await this.usersService.updateUsername(
      id,
      userUsernameReqDto.username,
    );
    return this.usersService.toUserDto(user);
  }

  @Put('/user/password')
  async updatePassword(
    @Request() req: RequestWithUser,
    @Body() userPasswordReqDto: UserPasswordReqDto,
  ) {
    const id = req.user.id;
    const user = await this.usersService.updatePassword(
      id,
      userPasswordReqDto.password,
    );
    return this.usersService.toUserDto(user);
  }

  @Put('/user/avatar')
  async updateAvatar(
    @Request() req: RequestWithUser,
    @Body() userAvatarReqDto: UserAvatarReqDto,
  ) {
    const id = req.user.id;
    const user = await this.usersService.updateAvatar(
      id,
      userAvatarReqDto.avatar,
    );
    return this.usersService.toUserDto(user);
  }

  @Put('/user/privileges')
  @Roles([Role.Admin])
  async updatePrivileges(@Body() userPrivilegesReqDto: UserPrivilegesReqDto) {
    const user = await this.usersService.updatePrivileges(
      userPrivilegesReqDto.username,
      userPrivilegesReqDto.emailVerified,
      userPrivilegesReqDto.roles,
      userPrivilegesReqDto.credit,
    );
    return this.usersService.toUserDto(user);
  }

  @Put('/user/reduce-credit')
  async reduceCredit(
    @Request() req: RequestWithUser,
    @Body() reduceCreditReqDto: ReduceCreditReqDto,
  ) {
    const id = req.user.id;
    const user = await this.usersService.reduceCredit(
      id,
      reduceCreditReqDto.amount,
    );
    return this.usersService.toUserDto(user);
  }

  @Delete('/user')
  delete(@Request() req: RequestWithUser) {
    const id = req.user.id;
    return this.usersService.remove(id);
  }

  @Delete('/user/:id')
  @Roles([Role.Admin])
  deleteById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
