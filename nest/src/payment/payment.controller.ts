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
import { Public } from '../common/decorators/public.decorator';
import { CheckoutReqDto } from './dto/payment.req.dto';
import { RequestWithUser } from '../auth/interfaces/request-with-user.interface';
import { CheckoutResDto, ProductResDto } from './dto/payment.res.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Public()
  @Get('products')
  getProducts(): ProductResDto[] {
    return this.paymentService.getProducts();
  }

  @Post('checkout')
  async createCheckout(
    @Request() req: RequestWithUser,
    @Body() dto: CheckoutReqDto,
  ): Promise<CheckoutResDto> {
    const user = req.user;

    const checkoutUrl = await this.paymentService.createCheckout(
      dto.productId,
      user.id,
      user.email,
    );

    return { checkoutUrl };
  }

  @Public()
  @Post('webhook')
  async handleCreemWebhook(
    @Headers('creem-signature') signature: string,
    @Req() request: RawBodyRequest<ExpressRequest>,
  ) {
    const rawBody = request.rawBody;
    if (!rawBody) {
      throw new BadRequestException('Missing raw body');
    }
    const payload = rawBody.toString('utf-8');

    if (!signature) {
      throw new BadRequestException('Missing signature');
    }

    await this.paymentService.handleWebhookEvents(payload, signature);

    return 'OK';
  }
}
