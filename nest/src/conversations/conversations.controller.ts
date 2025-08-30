import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { RequestWithUser } from '../auth/interfaces/request-with-user.interface';
import { ConversationsService } from './conversations.service';
import {
  ConversationNameReqDto,
  ConversationReqDto,
} from './dto/conversation.req.dto';
import { UserUsernameReqDto } from '../users/dto/user.req.dto';

@Controller('conversations')
export class ConversationsController {
  constructor(private readonly service: ConversationsService) {}

  @Get()
  async find(@Request() req: RequestWithUser) {
    const userId = req.user.id;
    const conversations = await this.service.find(userId);
    return conversations.map((conversation) =>
      this.service.toConversationDto(conversation),
    );
  }

  @Get('/update-times')
  async findUpdateTimes(@Request() req: RequestWithUser) {
    const userId = req.user.id;
    return await this.service.findUpdateTimes(userId);
  }

  @Get('/conversation/:id')
  async findOne(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const userId = req.user.id;
    const conversation = await this.service.findOne(userId, id);
    return this.service.toConversationDto(conversation);
  }

  @Post('/conversation')
  async create(
    @Request() req: RequestWithUser,
    @Body() reqDto: ConversationReqDto,
  ) {
    const userId = req.user.id;
    const conversation = await this.service.create(
      userId,
      reqDto.name,
      reqDto.messages,
      reqDto.colorLabel,
    );
    return this.service.toConversationDto(conversation);
  }

  @Post('/conversation/:id/clone')
  async cloneForSpecificUser(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() reqDto: UserUsernameReqDto,
  ) {
    const userId = req.user.id;
    const conversation = await this.service.cloneForSpecificUser(
      userId,
      id,
      reqDto.username,
    );
    return this.service.toConversationDto(conversation);
  }

  @Post('/conversation/:id/users')
  async addUserForUsers(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() reqDto: UserUsernameReqDto,
  ) {
    const userId = req.user.id;
    const conversation = await this.service.addUserForUsers(
      userId,
      id,
      reqDto.username,
    );
    return this.service.toConversationDto(conversation);
  }

  @Put('/conversation/:id')
  async update(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() reqDto: ConversationReqDto,
  ) {
    const userId = req.user.id;
    const conversation = await this.service.update(
      userId,
      id,
      reqDto.name,
      reqDto.messages,
      reqDto.colorLabel,
    );
    return this.service.toConversationDto(conversation);
  }

  @Put('/conversation/:id/name')
  async updateName(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() reqDto: ConversationNameReqDto,
  ) {
    const userId = req.user.id;
    const updatedConversation = await this.service.updateName(
      userId,
      id,
      reqDto.name,
    );
    return this.service.toConversationDto(updatedConversation);
  }

  @Delete('/conversation/:id')
  async delete(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const userId = req.user.id;
    const deletedConversation = await this.service.remove(userId, id);
    return this.service.toConversationDto(deletedConversation);
  }
}
