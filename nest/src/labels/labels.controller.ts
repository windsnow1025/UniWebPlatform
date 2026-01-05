import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import { RequestWithUser } from '../auth/interfaces/request-with-user.interface';
import { LabelsService } from './labels.service';
import { LabelReqDto } from './dto/label.req.dto';
import { LabelsCoreService } from './labels.core.service';

@Controller('labels')
export class LabelsController {
  constructor(
    private readonly service: LabelsService,
    private readonly coreService: LabelsCoreService,
  ) {}

  @Get()
  async find(@Request() req: RequestWithUser) {
    const userId = req.user.id;
    const labels = await this.service.find(userId);
    return labels.map((label) => this.coreService.toLabelDto(label));
  }

  @Get(':id')
  async findOne(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const userId = req.user.id;
    const label = await this.coreService.findOne(userId, id);
    return this.coreService.toLabelDto(label);
  }

  @Post()
  async create(@Request() req: RequestWithUser, @Body() reqDto: LabelReqDto) {
    const userId = req.user.id;
    const label = await this.service.create(userId, reqDto.name, reqDto.color);
    return this.coreService.toLabelDto(label);
  }

  @Patch(':id')
  async update(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() reqDto: LabelReqDto,
  ) {
    const userId = req.user.id;
    const label = await this.service.update(
      userId,
      id,
      reqDto.name,
      reqDto.color,
    );
    return this.coreService.toLabelDto(label);
  }

  @Delete(':id')
  async delete(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const userId = req.user.id;
    const deletedLabel = await this.service.delete(userId, id);
    return this.coreService.toLabelDto(deletedLabel);
  }
}
