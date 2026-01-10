import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class CreemService {
  private readonly logger = new Logger(CreemService.name);
  private readonly webhookSecret: string;

  constructor(private readonly configService: ConfigService) {
    this.webhookSecret = this.configService.get<string>('creem.webhookSecret')!;
  }

  /**
   * Verify Creem webhook signature using HMAC-SHA256
   * @param payload - Raw request body as string
   * @param signature - Signature from 'creem-signature' header
   * @returns true if signature is valid
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
}
