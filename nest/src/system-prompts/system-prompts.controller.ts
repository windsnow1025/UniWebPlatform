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
import { SystemPromptsService } from './system-prompts.service';
import {
  SystemPromptReqDto,
  SystemPromptNameReqDto,
} from './dto/system-prompt.req.dto';

@Controller('system-prompts')
export class SystemPromptsController {
  constructor(private readonly service: SystemPromptsService) {}

  @Get()
  async find(@Request() req: RequestWithUser) {
    const userId = req.user.id;
    const systemPrompts = await this.service.find(userId);
    return systemPrompts.map((systemPrompt) =>
      this.service.toSystemPromptDto(systemPrompt),
    );
  }

  @Get('/system-prompt/:id')
  async findOne(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const userId = req.user.id;
    const systemPrompt = await this.service.findOne(userId, id);
    return this.service.toSystemPromptDto(systemPrompt);
  }

  @Post('/system-prompt')
  async create(
    @Request() req: RequestWithUser,
    @Body() reqDto: SystemPromptReqDto,
  ) {
    const userId = req.user.id;
    const systemPrompt = await this.service.create(
      userId,
      reqDto.name,
      reqDto.contents,
    );
    return this.service.toSystemPromptDto(systemPrompt);
  }

  @Put('/system-prompt/:id')
  async update(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() reqDto: SystemPromptReqDto,
    @Headers('if-match') ifMatch: string,
  ) {
    const userId = req.user.id;
    const systemPrompt = await this.service.update(
      userId,
      id,
      reqDto.name,
      reqDto.contents,
      ifMatch,
    );
    return this.service.toSystemPromptDto(systemPrompt);
  }

  @Put('/system-prompt/:id/name')
  async updateName(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() reqDto: SystemPromptNameReqDto,
    @Headers('if-match') ifMatch: string,
  ) {
    const userId = req.user.id;
    const systemPrompt = await this.service.updateName(
      userId,
      id,
      reqDto.name,
      ifMatch,
    );
    return this.service.toSystemPromptDto(systemPrompt);
  }

  @Delete('/system-prompt/:id')
  async delete(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const userId = req.user.id;
    const deletedSystemPrompt = await this.service.delete(userId, id);
    return this.service.toSystemPromptDto(deletedSystemPrompt);
  }
}
