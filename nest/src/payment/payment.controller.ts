import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Post,
  RawBodyRequest,
  Req,
  Request,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { PaymentService } from './payment.service';
import { CreemService } from './creem.service';
import { Public } from '../common/decorators/public.decorator';
import { CreemWebhookEvent } from './dto/webhook.dto';
import { CheckoutReqDto } from './dto/checkout.req.dto';
import { RequestWithUser } from '../auth/interfaces/request-with-user.interface';
import { ProductsDto } from './dto/product.res.dto';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly creemService: CreemService,
  ) {}

  @Public()
  @Get('products')
  getProducts(): ProductsDto {
    return this.creemService.getProducts();
  }

  /**
   * Create a Creem checkout session
   * Returns a checkout URL to redirect the user to
   */
  @Post('checkout')
  async createCheckout(
    @Request() req: RequestWithUser,
    @Body() dto: CheckoutReqDto,
  ) {
    const { id: userId, email } = req.user;

    const checkoutUrl = await this.creemService.createCheckout(
      dto.productId,
      userId,
      email,
    );

    return { checkoutUrl };
  }

  /**
   * Creem Webhook endpoint
   * Receives payment events from Creem and processes them
   */
  @Public()
  @Post('webhook')
  async handleCreemWebhook(
    @Headers('creem-signature') signature: string,
    @Req() request: RawBodyRequest<ExpressRequest>,
  ) {
    // Get raw body for signature verification
    const rawBody = request.rawBody;
    if (!rawBody) {
      throw new BadRequestException('Raw body is required');
    }

    const payload = rawBody.toString('utf-8');

    // Verify signature
    if (!signature) {
      throw new BadRequestException('Missing signature');
    }

    if (!this.creemService.verifySignature(payload, signature)) {
      throw new BadRequestException('Invalid signature');
    }

    // Parse and process event
    const event: CreemWebhookEvent = JSON.parse(payload);

    await this.paymentService.handleWebhookEvent(event);

    // Return 200 OK to acknowledge receipt
    return { received: true };
  }
}
