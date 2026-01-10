import {
  BadRequestException,
  Controller,
  Headers,
  Logger,
  Post,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { PaymentService } from './payment.service';
import { CreemService } from './creem.service';
import { Public } from '../common/decorators/public.decorator';
import { CreemWebhookEvent } from './dto/creem-webhook.dto';

@Controller('payment')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(
    private readonly paymentService: PaymentService,
    private readonly creemService: CreemService,
  ) {}

  /**
   * Creem Webhook endpoint
   * Receives payment events from Creem and processes them
   */
  @Public()
  @Post('webhook/creem')
  async handleCreemWebhook(
    @Headers('creem-signature') signature: string,
    @Req() request: RawBodyRequest<Request>,
  ) {
    // Get raw body for signature verification
    const rawBody = request.rawBody;
    if (!rawBody) {
      this.logger.error('Raw body is not available');
      throw new BadRequestException('Raw body is required');
    }

    const payload = rawBody.toString('utf-8');

    // Verify signature
    if (!signature) {
      this.logger.warn('Missing creem-signature header');
      throw new BadRequestException('Missing signature');
    }

    if (!this.creemService.verifySignature(payload, signature)) {
      throw new BadRequestException('Invalid signature');
    }

    // Parse and process event
    const event: CreemWebhookEvent = JSON.parse(payload);
    this.logger.log(`Received webhook event: ${event.eventType}`);

    await this.paymentService.handleWebhookEvent(event);

    // Return 200 OK to acknowledge receipt
    return { received: true };
  }
}
