import {
  Injectable,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common';
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

  private assertIfMatch(markdown: Markdown, ifMatch?: string) {
    if (!ifMatch) {
      return;
    }
    const current = `${markdown.version}`;
    if (ifMatch !== current) {
      throw new PreconditionFailedException('ETag mismatch');
    }
  }

  public toMarkdownDto(markdown: Markdown): MarkdownResDto {
    return {
      id: markdown.id,
      title: markdown.title,
      content: markdown.content,
      updatedAt: markdown.updatedAt,
      version: markdown.version,
    };
  }

  findAll() {
    return this.markdownsRepository.find({
      order: { updatedAt: 'DESC' },
    });
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

  async update(
    id: number,
    title: string,
    content: string,
    ifMatch?: string,
  ): Promise<Markdown> {
    const markdown = await this.findOne(id);
    if (!markdown) {
      throw new NotFoundException('Markdown not found');
    }

    this.assertIfMatch(markdown, ifMatch);

    markdown.title = title;
    markdown.content = content;

    return this.markdownsRepository.save(markdown);
  }

  async delete(id: number) {
    const result = await this.markdownsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Markdown not deleted');
    }
    return result;
  }
}
