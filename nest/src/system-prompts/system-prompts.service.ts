import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemPrompt } from './system-prompt.entity';
import { UsersCoreService } from '../users/users.core.service';
import { SystemPromptResDto } from './dto/system-prompt.res.dto';
import { Content } from '../conversations/message.entity';

@Injectable()
export class SystemPromptsService {
  constructor(
    @InjectRepository(SystemPrompt)
    private systemPromptsRepository: Repository<SystemPrompt>,
    private usersCoreService: UsersCoreService,
  ) {}

  public toSystemPromptDto(systemPrompt: SystemPrompt) {
    const systemPromptDto: SystemPromptResDto = {
      id: systemPrompt.id,
      name: systemPrompt.name,
      contents: systemPrompt.contents,
      user: this.usersCoreService.toUserDto(systemPrompt.user),
      updatedAt: systemPrompt.updatedAt,
      version: systemPrompt.version,
    };
    return systemPromptDto;
  }

  async find(userId: number): Promise<SystemPrompt[]> {
    return this.systemPromptsRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
      order: { updatedAt: 'DESC' },
    });
  }

  async findOne(userId: number, id: number): Promise<SystemPrompt> {
    const systemPrompt = await this.systemPromptsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!systemPrompt) {
      throw new NotFoundException('System Prompt not found');
    }

    if (systemPrompt.user.id !== userId) {
      throw new ForbiddenException();
    }

    return systemPrompt;
  }

  async create(
    userId: number,
    name: string,
    contents: Content[],
  ): Promise<SystemPrompt> {
    const user = await this.usersCoreService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const systemPrompt = new SystemPrompt();
    systemPrompt.name = name;
    systemPrompt.contents = contents;
    systemPrompt.user = user;

    return await this.systemPromptsRepository.save(systemPrompt);
  }

  async update(
    userId: number,
    id: number,
    name: string,
    contents: Content[],
    ifMatch?: string,
  ): Promise<SystemPrompt> {
    const systemPrompt = await this.findOne(userId, id);

    this.assertIfMatch(systemPrompt, ifMatch);

    systemPrompt.name = name;
    systemPrompt.contents = contents;

    return await this.systemPromptsRepository.save(systemPrompt);
  }

  async updateName(
    userId: number,
    id: number,
    name: string,
    ifMatch?: string,
  ): Promise<SystemPrompt> {
    const systemPrompt = await this.findOne(userId, id);

    this.assertIfMatch(systemPrompt, ifMatch);

    systemPrompt.name = name;

    return await this.systemPromptsRepository.save(systemPrompt);
  }

  async delete(userId: number, id: number): Promise<SystemPrompt> {
    const systemPrompt = await this.findOne(userId, id);

    const result = await this.systemPromptsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('System Prompt not deleted');
    }

    return systemPrompt;
  }

  private assertIfMatch(systemPrompt: SystemPrompt, ifMatch?: string) {
    if (!ifMatch) {
      return;
    }
    const current = `${systemPrompt.version}`;
    if (ifMatch !== current) {
      throw new PreconditionFailedException('ETag mismatch');
    }
  }
}
