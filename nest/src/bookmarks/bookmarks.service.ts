import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bookmark } from './bookmark.entity';
import { BookmarkResDto } from './dto/bookmark.res.dto';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectRepository(Bookmark)
    private bookmarksRepository: Repository<Bookmark>,
  ) {}

  public toBookmarkDto(bookmark: Bookmark): BookmarkResDto {
    return {
      id: bookmark.id,
      firstTitle: bookmark.firstTitle,
      secondTitle: bookmark.secondTitle,
      url: bookmark.url,
      comment: bookmark.comment,
    };
  }

  findAll() {
    return this.bookmarksRepository.find();
  }

  findOne(id: number) {
    return this.bookmarksRepository.findOneBy({ id });
  }

  create(
    firstTitle: string,
    secondTitle: string,
    url: string,
    comment: string,
  ) {
    const bookmark = new Bookmark();

    bookmark.firstTitle = firstTitle;
    bookmark.secondTitle = secondTitle;
    bookmark.url = url;
    bookmark.comment = comment;

    return this.bookmarksRepository.save(bookmark);
  }

  async update(
    id: number,
    firstTitle: string,
    secondTitle: string,
    url: string,
    comment: string,
  ) {
    const bookmark = await this.findOne(id);
    if (!bookmark) {
      throw new NotFoundException('Bookmark not found');
    }

    bookmark.firstTitle = firstTitle;
    bookmark.secondTitle = secondTitle;
    bookmark.url = url;
    bookmark.comment = comment;

    return this.bookmarksRepository.save(bookmark);
  }

  remove(id: number) {
    return this.bookmarksRepository.delete(id);
  }
}
