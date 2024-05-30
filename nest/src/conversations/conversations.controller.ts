import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { RequestWithUser } from '../auth/interfaces/request-with-user.interface';
import { Conversation } from './conversation.entity';
import { ConversationsService } from './conversations.service';

@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Get()
  find(@Request() req: RequestWithUser) {
    const userId = req.user.sub;
    return this.conversationsService.find(userId);
  }

  @Post('/conversation')
  create(@Request() req: RequestWithUser, @Body() conversation: Conversation) {
    const userId = req.user.sub;
    return this.conversationsService.create(userId, conversation);
  }

  @Put('/conversation')
  update(@Request() req: RequestWithUser, @Body() conversation: Conversation) {
    const userId = req.user.sub;
    return this.conversationsService.update(userId, conversation);
  }

  @Delete('/conversation/:id')
  delete(@Request() req: RequestWithUser, @Param('id') id: number) {
    const userId = req.user.sub;
    return this.conversationsService.remove(userId, id);
  }
}
