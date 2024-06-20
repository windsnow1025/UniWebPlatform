import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
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

  @Post('/conversation/:id/user')
  addUser(
    @Request() req: RequestWithUser,
    @Param('id') id: number,
    @Body('username') username: string,
  ) {
    const userId = req.user.sub;
    return this.conversationsService.addUser(userId, id, username);
  }

  @Put('/conversation')
  update(@Request() req: RequestWithUser, @Body() conversation: Conversation) {
    const userId = req.user.sub;
    return this.conversationsService.update(userId, conversation);
  }

  @Patch('/conversation/:id/name')
  updateName(
    @Request() req: RequestWithUser,
    @Param('id') id: number,
    @Body('name') name: string,
  ) {
    const userId = req.user.sub;
    return this.conversationsService.updateName(userId, id, name);
  }

  @Delete('/conversation/:id')
  delete(@Request() req: RequestWithUser, @Param('id') id: number) {
    const userId = req.user.sub;
    return this.conversationsService.remove(userId, id);
  }
}
