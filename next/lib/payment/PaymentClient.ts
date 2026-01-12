import {getNestOpenAPIConfiguration} from "../common/APIConfig";
import {PaymentApi, ProductResDto} from "@/client/nest";

export default class PaymentClient {
  async fetchProducts(): Promise<ProductResDto[]> {
    const api = new PaymentApi(getNestOpenAPIConfiguration());
    const res = await api.paymentControllerGetProducts();
    return res.data;
  }

  async createCheckout(productId: string): Promise<string> {
    const api = new PaymentApi(getNestOpenAPIConfiguration());
    const res = await api.paymentControllerCreateCheckout({productId});
    return res.data.checkoutUrl;
  }
}
