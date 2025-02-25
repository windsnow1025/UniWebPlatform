import { IsString } from 'class-validator';

export class AuthTokenReqDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}
