import { Injectable } from '@nestjs/common';
import { UsersCoreService } from '../users/users.core.service';

@Injectable()
export class PaymentService {
  constructor(private readonly usersCoreService: UsersCoreService) {}
}
