import { IsString } from 'class-validator';

export class UserReqDto {
  @IsString()
  username: string;

  @IsString()
  email: string;

  @IsString()
  password: string;
}

export class UserUsernameReqDto {
  @IsString()
  username: string;
}

export class UserEmailReqDto {
  @IsString()
  email: string;
}

export class UserPasswordReqDto {
  @IsString()
  password: string;
}
