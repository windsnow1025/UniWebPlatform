import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

interface CreateCheckoutParams {
  productId: string;
  userId: number;
  email: string;
  successUrl?: string;
}

interface CreemCheckoutResponse {
  id: string;
  checkout_url: string;
  status: string;
}

@Injectable()
export class CreemService {
  private readonly logger = new Logger(CreemService.name);
  private readonly webhookSecret: string;
  private readonly apiKey: string;
  private readonly apiBaseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.webhookSecret = this.configService.get<string>('creem.webhookSecret')!;
    this.apiKey = this.configService.get<string>('creem.apiKey')!;

    // Use test API in development
    const isProduction = this.configService.get<boolean>('isProduction');
    this.apiBaseUrl = isProduction
      ? 'https://api.creem.io'
      : 'https://test-api.creem.io';
  }

  /**
   * Verify Creem webhook signature using HMAC-SHA256
   */
  verifySignature(payload: string, signature: string): boolean {
    const computedSignature = crypto
      .createHmac('sha256', this.webhookSecret)
      .update(payload)
      .digest('hex');

    const isValid = computedSignature === signature;

    if (!isValid) {
      this.logger.warn('Webhook signature verification failed');
    }

    return isValid;
  }

  /**
   * Create a Creem checkout session
   */
  async createCheckout(
    params: CreateCheckoutParams,
  ): Promise<{ checkoutUrl: string }> {
    const { productId, userId, email, successUrl } = params;

    const requestBody = {
      product_id: productId,
      customer: { email },
      metadata: { userId },
      ...(successUrl && { success_url: successUrl }),
    };

    this.logger.log(
      `Creating checkout for user ${userId}, product ${productId}`,
    );

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
      this.logger.error(`Creem API error: ${response.status} - ${errorText}`);
      throw new Error(`Failed to create checkout: ${response.status}`);
    }

    const data: CreemCheckoutResponse = await response.json();
    this.logger.log(`Checkout created: ${data.id}`);

    return { checkoutUrl: data.checkout_url };
  }
}
