import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { CreemService } from './creem.service';
import { CoreModule } from '../core/core.module';

@Module({
  imports: [ConfigModule, CoreModule],
  providers: [PaymentService, CreemService],
  controllers: [PaymentController],
})
export class PaymentModule {}
