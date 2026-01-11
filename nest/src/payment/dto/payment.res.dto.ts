// Internal type for env config
export type Products = Record<string, number>;

// Response DTO
export class ProductResDto {
  id: string;
  credit: number;
}

export class CheckoutResDto {
  checkoutUrl: string;
}
