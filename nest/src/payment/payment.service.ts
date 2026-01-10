import { Injectable } from '@nestjs/common';
import { UsersCoreService } from '../users/users.core.service';

@Injectable()
export class PaymentService {
  constructor(private readonly usersCoreService: UsersCoreService) {}

  async processWebhook(
    rawBody: Buffer | undefined,
    headers: Record<string, string>,
    body: any,
  ): Promise<{ received: boolean }> {
    return { received: true };
  }
}
