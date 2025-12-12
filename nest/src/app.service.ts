import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getRoot() {
    return { message: 'Welcome to the NestJS. See /docs for details.' };
  }
}
