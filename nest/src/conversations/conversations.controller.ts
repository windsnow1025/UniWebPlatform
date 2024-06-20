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
  async find(@Request() req: RequestWithUser) {
    const userId = req.user.sub;
    const conversations = await this.conversationsService.find(userId);
    return conversations.map((conversation) =>
      this.conversationsService.toConversationDto(conversation),
    );
  }

  @Post('/conversation')
  async create(
    @Request() req: RequestWithUser,
    @Body() conversation: Conversation,
  ) {
    const userId = req.user.sub;
    const savedConversation = await this.conversationsService.create(
      userId,
      conversation,
    );
    return this.conversationsService.toConversationDto(savedConversation);
  }

  @Post('/conversation/:id/user')
  async addUser(
    @Request() req: RequestWithUser,
    @Param('id') id: number,
    @Body('username') username: string,
  ) {
    const userId = req.user.sub;
    const updatedConversation = await this.conversationsService.addUser(
      userId,
      id,
      username,
    );
    return this.conversationsService.toConversationDto(updatedConversation);
  }

  @Put('/conversation')
  async update(
    @Request() req: RequestWithUser,
    @Body() conversation: Conversation,
  ) {
    const userId = req.user.sub;
    const updatedConversation = await this.conversationsService.update(
      userId,
      conversation,
    );
    return this.conversationsService.toConversationDto(updatedConversation);
  }

  @Patch('/conversation/:id/name')
  async updateName(
    @Request() req: RequestWithUser,
    @Param('id') id: number,
    @Body('name') name: string,
  ) {
    const userId = req.user.sub;
    const updatedConversation = await this.conversationsService.updateName(
      userId,
      id,
      name,
    );
    return this.conversationsService.toConversationDto(updatedConversation);
  }

  @Delete('/conversation/:id')
  async delete(@Request() req: RequestWithUser, @Param('id') id: number) {
    const userId = req.user.sub;
    const deletedConversation = await this.conversationsService.remove(
      userId,
      id,
    );
    return this.conversationsService.toConversationDto(deletedConversation);
  }
}
