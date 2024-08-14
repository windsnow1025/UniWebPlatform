import { IsString } from 'class-validator';

export class AuthReqDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
