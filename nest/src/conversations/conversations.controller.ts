import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
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
  ConversationColorReqDto,
  ConversationPublicReqDto,
} from './dto/conversation.req.dto';
import { UserUsernameReqDto } from '../users/dto/user.req.dto';
import { Public } from '../common/decorators/public.decorator';

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

  @Public()
  @Get('/public/conversation/:id')
  async findPublicOne(@Param('id', ParseIntPipe) id: number) {
    const conversation = await this.service.findPublicOne(id);
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
    @Headers('if-match') ifMatch: string,
  ) {
    const userId = req.user.id;
    const conversation = await this.service.addUserForUsers(
      userId,
      id,
      reqDto.username,
      ifMatch,
    );
    return this.service.toConversationDto(conversation);
  }

  @Put('/conversation/:id')
  async update(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() reqDto: ConversationReqDto,
    @Headers('if-match') ifMatch: string,
  ) {
    const userId = req.user.id;
    const conversation = await this.service.update(
      userId,
      id,
      reqDto.name,
      reqDto.messages,
      ifMatch,
    );
    return this.service.toConversationDto(conversation);
  }

  @Put('/conversation/:id/name')
  async updateName(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() reqDto: ConversationNameReqDto,
    @Headers('if-match') ifMatch: string,
  ) {
    const userId = req.user.id;
    const updatedConversation = await this.service.updateName(
      userId,
      id,
      reqDto.name,
      ifMatch,
    );
    return this.service.toConversationDto(updatedConversation);
  }

  @Put('/conversation/:id/public')
  async updatePublic(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() reqDto: ConversationPublicReqDto,
    @Headers('if-match') ifMatch: string,
  ) {
    const userId = req.user.id;
    const updatedConversation = await this.service.updatePublic(
      userId,
      id,
      reqDto.isPublic,
      ifMatch,
    );
    return this.service.toConversationDto(updatedConversation);
  }

  @Put('/conversation/:id/color-label')
  async updateColorLabel(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() reqDto: ConversationColorReqDto,
    @Headers('if-match') ifMatch: string,
  ) {
    const userId = req.user.id;
    const updatedConversation = await this.service.updateColorLabel(
      userId,
      id,
      reqDto.colorLabel,
      ifMatch,
    );
    return this.service.toConversationDto(updatedConversation);
  }

  @Delete('/conversation/:id')
  async delete(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const userId = req.user.id;
    const deletedConversation = await this.service.delete(userId, id);
    return this.service.toConversationDto(deletedConversation);
  }
}
