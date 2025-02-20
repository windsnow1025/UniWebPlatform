import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { Markdown } from './markdown.entity';
import { MarkdownsService } from './markdowns.service';

@Controller('markdowns')
export class MarkdownsController {
  constructor(private readonly markdownsService: MarkdownsService) {}

  @Public()
  @Get()
  findAll() {
    return this.markdownsService.findAll();
  }

  @Public()
  @Get('/markdown/:id')
  findOne(@Param('id') id: number) {
    return this.markdownsService.findOne(id);
  }

  @Post('/markdown')
  @Roles([Role.Admin])
  create(@Body() markdown: Markdown) {
    return this.markdownsService.create(markdown);
  }

  @Put('/markdown')
  @Roles([Role.Admin])
  update(@Body() markdown: Markdown) {
    return this.markdownsService.update(markdown);
  }

  @Delete('/markdown/:id')
  @Roles([Role.Admin])
  delete(@Param('id') id: number) {
    return this.markdownsService.remove(id);
  }
}
