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
import { PromptsService } from './prompts.service';
import { PromptNameReqDto, PromptReqDto } from './dto/prompt.req.dto';

@Controller('prompts')
export class PromptsController {
  constructor(private readonly service: PromptsService) {}

  @Get()
  async find(@Request() req: RequestWithUser) {
    const userId = req.user.id;
    const prompts = await this.service.find(userId);
    return prompts.map((prompt) => this.service.toPromptDto(prompt));
  }

  @Get('prompt/:id')
  async findOne(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const userId = req.user.id;
    const prompt = await this.service.findOne(userId, id);
    return this.service.toPromptDto(prompt);
  }

  @Post('prompt')
  async create(@Request() req: RequestWithUser, @Body() reqDto: PromptReqDto) {
    const userId = req.user.id;
    const prompt = await this.service.create(
      userId,
      reqDto.name,
      reqDto.contents,
    );
    return this.service.toPromptDto(prompt);
  }

  @Put('prompt/:id')
  async update(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() reqDto: PromptReqDto,
    @Headers('if-match') ifMatch: string,
  ) {
    const userId = req.user.id;
    const prompt = await this.service.update(
      userId,
      id,
      reqDto.name,
      reqDto.contents,
      ifMatch,
    );
    return this.service.toPromptDto(prompt);
  }

  @Put('prompt/:id/name')
  async updateName(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() reqDto: PromptNameReqDto,
    @Headers('if-match') ifMatch: string,
  ) {
    const userId = req.user.id;
    const prompt = await this.service.updateName(
      userId,
      id,
      reqDto.name,
      ifMatch,
    );
    return this.service.toPromptDto(prompt);
  }

  @Delete('prompt/:id')
  async delete(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const userId = req.user.id;
    const deletedPrompt = await this.service.delete(userId, id);
    return this.service.toPromptDto(deletedPrompt);
  }
}
