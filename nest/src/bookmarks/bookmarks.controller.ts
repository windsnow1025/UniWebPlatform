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
  findAll() {
    return this.bookmarksService.findAll();
  }

  @Post('/bookmark')
  @Roles([Role.Admin])
  create(@Body() bookmark: Bookmark) {
    return this.bookmarksService.create(bookmark);
  }

  @Put('/bookmark')
  @Roles([Role.Admin])
  update(@Body() bookmark: Bookmark) {
    return this.bookmarksService.update(bookmark);
  }

  @Delete('/bookmark/:id')
  @Roles([Role.Admin])
  delete(@Param('id') id: number) {
    return this.bookmarksService.remove(id);
  }
}
