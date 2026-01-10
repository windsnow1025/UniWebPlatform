import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UsersCoreService } from '../users/users.core.service';
import {
  CreemCheckoutObject,
  CreemWebhookEvent,
} from './dto/creem-webhook.dto';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(private readonly usersCoreService: UsersCoreService) {}

  /**
   * Handle Creem webhook events
   * Only processes checkout.completed event
   * @param event - Parsed webhook event
   */
  async handleWebhookEvent(event: CreemWebhookEvent): Promise<void> {
    this.logger.log(
      `Processing webhook event: ${event.eventType} (${event.id})`,
    );

    switch (event.eventType) {
      case 'checkout.completed':
        await this.handleCheckoutCompleted(
          event as CreemWebhookEvent<CreemCheckoutObject>,
        );
        break;
      default:
        this.logger.log(`Ignoring event type: ${event.eventType}`);
    }
  }

  /**
   * Handle checkout.completed event - add credit to user
   */
  private async handleCheckoutCompleted(
    event: CreemWebhookEvent<CreemCheckoutObject>,
  ): Promise<void> {
    const { object } = event;
    const userId = object.metadata?.userId as number | undefined;
    const productPrice = object.product.price; // in cents

    if (!userId) {
      this.logger.error(`No userId in metadata for checkout ${object.id}`);
      return;
    }

    // Convert cents to credit (100 cents = 1 credit = 1 USD)
    const creditAmount = productPrice / 100;

    this.logger.log(
      `Adding ${creditAmount} credit to user ${userId} for checkout ${object.id}`,
    );

    try {
      await this.usersCoreService.adjustCredit(userId, creditAmount);
      this.logger.log(`Successfully added credit to user ${userId}`);
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.error(`User ${userId} not found`);
      } else {
        throw error;
      }
    }
  }
}
