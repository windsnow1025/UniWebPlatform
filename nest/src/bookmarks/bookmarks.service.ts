import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bookmark } from './bookmark.entity';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectRepository(Bookmark)
    private bookmarksRepository: Repository<Bookmark>,
  ) {}

  findAll() {
    return this.bookmarksRepository.find();
  }

  findOne(id: number) {
    return this.bookmarksRepository.findOneBy({ id });
  }

  create(bookmark: Bookmark) {
    return this.bookmarksRepository.save(bookmark);
  }

  async update(newBookmark: Bookmark) {
    const bookmark = await this.findOne(newBookmark.id);
    if (!bookmark) {
      throw new NotFoundException('Bookmark not found');
    }

    bookmark.firstTitle = newBookmark.firstTitle;
    bookmark.secondTitle = newBookmark.secondTitle;
    bookmark.url = newBookmark.url;
    bookmark.comment = newBookmark.comment;

    return this.bookmarksRepository.save(bookmark);
  }

  remove(id: number) {
    return this.bookmarksRepository.delete(id);
  }
}
