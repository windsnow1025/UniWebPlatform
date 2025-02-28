import { IsString } from 'class-validator';

export class TokenEmailReqDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}

export class TokenUsernameReqDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
