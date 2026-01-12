import PaymentClient from "./PaymentClient";
import {ProductResDto} from "@/client/nest";
import {handleError} from "../common/ErrorHandler";

export default class PaymentLogic {
  private paymentClient: PaymentClient;

  constructor() {
    this.paymentClient = new PaymentClient();
  }

  async fetchProducts(): Promise<ProductResDto[]> {
    try {
      return await this.paymentClient.fetchProducts();
    } catch (error) {
      handleError(error, 'Failed to fetch products');
    }
  }

  async createCheckout(productId: string): Promise<string> {
    try {
      return await this.paymentClient.createCheckout(productId);
    } catch (error) {
      handleError(error, 'Failed to create checkout');
    }
  }
}
