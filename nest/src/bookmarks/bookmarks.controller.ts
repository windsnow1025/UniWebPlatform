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
import { Bookmark } from './bookmark.entity';
import { BookmarksService } from './bookmarks.service';

@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Public()
  @Get()
  async findAll() {
    return await this.bookmarksService.findAll();
  }

  @Post('/bookmark')
  @Roles(Role.Admin)
  async create(@Body() bookmark: Bookmark) {
    return await this.bookmarksService.create(bookmark);
  }

  @Put('/bookmark')
  @Roles(Role.Admin)
  async update(@Body() bookmark: Bookmark) {
    return await this.bookmarksService.update(bookmark);
  }

  @Delete('/bookmark/:id')
  @Roles(Role.Admin)
  async delete(@Param('id') id: number) {
    return await this.bookmarksService.remove(id);
  }
}
