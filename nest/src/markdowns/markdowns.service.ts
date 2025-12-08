import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Markdown } from './markdown.entity';
import { MarkdownResDto } from './dto/markdown.res.dto';

@Injectable()
export class MarkdownsService {
  constructor(
    @InjectRepository(Markdown)
    private markdownsRepository: Repository<Markdown>,
  ) {}

  public toMarkdownDto(markdown: Markdown): MarkdownResDto {
    return {
      id: markdown.id,
      title: markdown.title,
      content: markdown.content,
      updatedAt: markdown.updatedAt,
    };
  }

  findAll() {
    return this.markdownsRepository.find();
  }

  findOne(id: number) {
    return this.markdownsRepository.findOneBy({ id });
  }

  create(title: string, content: string): Promise<Markdown> {
    const markdown = new Markdown();

    markdown.title = title;
    markdown.content = content;

    return this.markdownsRepository.save(markdown);
  }

  async update(id: number, title: string, content: string): Promise<Markdown> {
    const markdown = await this.findOne(id);
    if (!markdown) {
      throw new NotFoundException('Markdown not found');
    }

    markdown.title = title;
    markdown.content = content;

    return this.markdownsRepository.save(markdown);
  }

  remove(id: number) {
    return this.markdownsRepository.delete(id);
  }
}
