import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Markdown } from './markdown.entity';

@Injectable()
export class MarkdownsService {
  constructor(
    @InjectRepository(Markdown)
    private markdownsRepository: Repository<Markdown>,
  ) {}

  findAll() {
    return this.markdownsRepository.find();
  }

  findOne(id: number) {
    return this.markdownsRepository.findOneBy({ id });
  }

  create(markdown: Markdown) {
    return this.markdownsRepository.save(markdown);
  }

  async update(newMarkdown: Markdown) {
    const markdown = await this.findOne(newMarkdown.id);
    if (!markdown) {
      throw new NotFoundException();
    }

    markdown.title = newMarkdown.title;
    markdown.content = newMarkdown.content;

    return this.markdownsRepository.save(markdown);
  }

  async remove(id: number) {
    return await this.markdownsRepository.delete(id);
  }
}
