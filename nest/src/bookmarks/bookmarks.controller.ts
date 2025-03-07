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
import { BookmarksService } from './bookmarks.service';
import { BookmarkReqDto } from './dto/bookmark.req.dto';
import { BookmarkResDto } from './dto/bookmark.res.dto';

@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly service: BookmarksService) {}

  @Public()
  @Get()
  async findAll(): Promise<BookmarkResDto[]> {
    const bookmarks = await this.service.findAll();
    return bookmarks.map((bookmark) => this.service.toBookmarkDto(bookmark));
  }

  @Post('/bookmark')
  @Roles([Role.Admin])
  async create(@Body() reqDto: BookmarkReqDto): Promise<BookmarkResDto> {
    const bookmark = await this.service.create(
      reqDto.firstTitle,
      reqDto.secondTitle,
      reqDto.url,
      reqDto.comment,
    );
    return this.service.toBookmarkDto(bookmark);
  }

  @Put('/bookmark/:id')
  @Roles([Role.Admin])
  async update(
    @Param('id') id: number,
    @Body() reqDto: BookmarkReqDto,
  ): Promise<BookmarkResDto> {
    const bookmark = await this.service.update(
      id,
      reqDto.firstTitle,
      reqDto.secondTitle,
      reqDto.url,
      reqDto.comment,
    );
    return this.service.toBookmarkDto(bookmark);
  }

  @Delete('/bookmark/:id')
  @Roles([Role.Admin])
  delete(@Param('id') id: number) {
    return this.service.remove(id);
  }
}
