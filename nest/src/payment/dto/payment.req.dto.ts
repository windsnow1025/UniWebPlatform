import { IsString } from 'class-validator';

export class CheckoutReqDto {
  @IsString()
  productId: string;
}
