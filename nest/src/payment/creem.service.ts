import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { ProductsDto } from './dto/payment.res.dto';

@Injectable()
export class CreemService {
  private readonly apiKey: string;
  private readonly webhookSecret: string;
  private readonly apiBaseUrl: string;
  private readonly frontendUrl: string;
  private readonly products: ProductsDto;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('creem.apiKey')!;
    this.webhookSecret = this.configService.get<string>('creem.webhookSecret')!;
    this.apiBaseUrl = this.configService.get<string>('creem.apiUrl')!;
    this.frontendUrl = this.configService.get<string>('frontendUrl')!;
    this.products = this.configService.get<ProductsDto>('creem.products')!;
  }

  getProducts(): ProductsDto {
    return this.products;
  }

  verifySignature(payload: string, signature: string): boolean {
    const computedSignature = crypto
      .createHmac('sha256', this.webhookSecret)
      .update(payload)
      .digest('hex');

    return computedSignature === signature;
  }

  async createCheckout(
    productId: string,
    userId: number,
    email: string,
  ): Promise<string> {
    const successUrl = `${this.frontendUrl}/pricing/purchase`;

    const requestBody = {
      product_id: productId,
      customer: { email },
      metadata: { userId },
      success_url: successUrl,
    };

    const response = await fetch(`${this.apiBaseUrl}/v1/checkouts`, {
      method: 'POST',
      headers: {
        'x-api-key': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to create checkout: ${response.status} - ${errorText}`,
      );
    }

    const data = await response.json();
    return data.checkout_url;
  }
}
