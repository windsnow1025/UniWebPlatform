import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prompt } from './prompt.entity';
import { UsersCoreService } from '../users/users.core.service';
import { PromptResDto } from './dto/prompt.res.dto';
import { Content } from '../conversations/message.entity';

@Injectable()
export class PromptsService {
  constructor(
    @InjectRepository(Prompt)
    private promptsRepository: Repository<Prompt>,
    private usersCoreService: UsersCoreService,
  ) {}

  public toPromptDto(prompt: Prompt) {
    const promptDto: PromptResDto = {
      id: prompt.id,
      name: prompt.name,
      contents: prompt.contents,
      user: this.usersCoreService.toUserDto(prompt.user),
      updatedAt: prompt.updatedAt,
      version: prompt.version,
    };
    return promptDto;
  }

  async find(userId: number): Promise<Prompt[]> {
    return this.promptsRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
      order: { updatedAt: 'DESC' },
    });
  }

  async findOne(userId: number, id: number): Promise<Prompt> {
    const prompt = await this.promptsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!prompt) {
      throw new NotFoundException('Prompt not found');
    }

    if (prompt.user.id !== userId) {
      throw new ForbiddenException();
    }

    return prompt;
  }

  async create(
    userId: number,
    name: string,
    contents: Content[],
  ): Promise<Prompt> {
    const user = await this.usersCoreService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const prompt = new Prompt();
    prompt.name = name;
    prompt.contents = contents;
    prompt.user = user;

    return await this.promptsRepository.save(prompt);
  }

  async update(
    userId: number,
    id: number,
    name: string,
    contents: Content[],
    ifMatch?: string,
  ): Promise<Prompt> {
    const prompt = await this.findOne(userId, id);

    this.assertIfMatch(prompt, ifMatch);

    prompt.name = name;
    prompt.contents = contents;

    return await this.promptsRepository.save(prompt);
  }

  async updateName(
    userId: number,
    id: number,
    name: string,
    ifMatch?: string,
  ): Promise<Prompt> {
    const prompt = await this.findOne(userId, id);

    this.assertIfMatch(prompt, ifMatch);

    prompt.name = name;

    return await this.promptsRepository.save(prompt);
  }

  async delete(userId: number, id: number): Promise<Prompt> {
    const prompt = await this.findOne(userId, id);

    const result = await this.promptsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Prompt not deleted');
    }

    return prompt;
  }

  private assertIfMatch(prompt: Prompt, ifMatch?: string) {
    if (!ifMatch) {
      return;
    }
    const current = `${prompt.version}`;
    if (ifMatch !== current) {
      throw new PreconditionFailedException('ETag mismatch');
    }
  }
}
