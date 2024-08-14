import { IsNumber } from 'class-validator';

export class UserPinReqDto {
  @IsNumber()
  pin: number;
}
