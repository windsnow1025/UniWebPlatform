import { IsNumber, IsString } from 'class-validator';

export class UserCreditReqDto {
  @IsString()
  username: string;

  @IsNumber()
  credit: number;
}
