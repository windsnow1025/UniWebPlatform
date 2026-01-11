import { getNestOpenAPIConfiguration } from "../common/APIConfig";
import { CheckoutResDto, PaymentApi } from "../../client/nest";

// Products format: { productId: credit }
export type ProductsDto = Record<string, number>;

export default class PaymentClient {
  async fetchProducts(): Promise<ProductsDto> {
    const api = new PaymentApi(getNestOpenAPIConfiguration());
    const res = await api.paymentControllerGetProducts();
    return res.data as ProductsDto;
  }

  async createCheckout(productId: string): Promise<string> {
    const api = new PaymentApi(getNestOpenAPIConfiguration());
    const res = await api.paymentControllerCreateCheckout({ productId });
    return res.data.checkoutUrl;
  }
}
