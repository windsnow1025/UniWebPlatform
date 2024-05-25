import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { Message } from './message.entity';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Public()
  @Get()
  findAll() {
    return this.messagesService.findAll();
  }

  @Public()
  @Post('/message')
  create(@Body() message: Message) {
    return this.messagesService.create(message);
  }

  @Public()
  @Delete()
  delete() {
    return this.messagesService.removeAll();
  }
}
