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
  async find(@Request() req: RequestWithUser) {
    const userId = req.user.sub;
    return await this.conversationsService.find(userId);
  }

  @Post('/conversation')
  async create(
    @Request() req: RequestWithUser,
    @Body() conversation: Conversation,
  ) {
    const userId = req.user.sub;
    return await this.conversationsService.create(userId, conversation);
  }

  @Put('/conversation')
  async update(
    @Request() req: RequestWithUser,
    @Body() conversation: Conversation,
  ) {
    const userId = req.user.sub;
    return await this.conversationsService.update(userId, conversation);
  }

  @Delete('/conversation/:id')
  async delete(@Request() req: RequestWithUser, @Param('id') id: number) {
    const userId = req.user.sub;
    return await this.conversationsService.remove(userId, id);
  }
}
