// Products format: { productId: credit }
export type ProductsDto = Record<string, number>;

export class CheckoutResDto {
  checkoutUrl: string;
}
