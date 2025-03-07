import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { MarkdownsService } from './markdowns.service';
import { MarkdownReqDto } from './dto/markdown.req.dto';
import { MarkdownResDto } from './dto/markdown.res.dto';

@Controller('markdowns')
export class MarkdownsController {
  constructor(private readonly service: MarkdownsService) {}

  @Public()
  @Get()
  async findAll(): Promise<MarkdownResDto[]> {
    const markdowns = await this.service.findAll();
    return markdowns.map((markdown) => this.service.toMarkdownDto(markdown));
  }

  @Public()
  @Get('/markdown/:id')
  async findOne(@Param('id') id: number): Promise<MarkdownResDto> {
    const markdown = await this.service.findOne(id);
    if (!markdown) {
      throw new NotFoundException('Markdown not found');
    }
    return this.service.toMarkdownDto(markdown);
  }

  @Post('/markdown')
  @Roles([Role.Admin])
  async create(@Body() reqDto: MarkdownReqDto): Promise<MarkdownResDto> {
    const markdown = await this.service.create(reqDto.title, reqDto.content);
    return this.service.toMarkdownDto(markdown);
  }

  @Put('/markdown/:id')
  @Roles([Role.Admin])
  async update(
    @Param('id') id: number,
    @Body() reqDto: MarkdownReqDto,
  ): Promise<MarkdownResDto> {
    const markdown = await this.service.update(
      id,
      reqDto.title,
      reqDto.content,
    );
    return this.service.toMarkdownDto(markdown);
  }

  @Delete('/markdown/:id')
  @Roles([Role.Admin])
  delete(@Param('id') id: number) {
    return this.service.remove(id);
  }
}
