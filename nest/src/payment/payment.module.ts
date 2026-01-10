import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { CoreModule } from '../core/core.module';
import { ConfigModule } from '@nestjs/config';
import { CreemService } from './creem.service';

@Module({
  imports: [ConfigModule, CoreModule],
  providers: [PaymentService, CreemService],
  controllers: [PaymentController],
})
export class PaymentModule {}
