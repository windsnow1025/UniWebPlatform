import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './conversation.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private conversationsRepository: Repository<Conversation>,
    private usersService: UsersService,
  ) {}

  find(userId: number) {
    return this.conversationsRepository
      .createQueryBuilder('conversation')
      .leftJoinAndSelect('conversation.users', 'user')
      .where('user.id = :userId', { userId })
      .getMany();
  }

  findOne(userId: number, id: number) {
    return this.conversationsRepository.findOne({
      where: {
        id,
        users: { id: userId },
      },
    });
  }

  async create(userId: number, conversation: Conversation) {
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new NotFoundException();
    }

    conversation.users = [user];
    return this.conversationsRepository.save(conversation);
  }

  async update(userId: number, newConversation: Conversation) {
    const conversation = await this.findOne(userId, newConversation.id);
    if (!conversation) {
      throw new NotFoundException();
    }

    conversation.name = newConversation.name;
    conversation.messages = newConversation.messages;

    return this.conversationsRepository.save(conversation);
  }

  async updateName(userId: number, id: number, name: string) {
    const conversation = await this.findOne(userId, id);
    if (!conversation) {
      throw new NotFoundException();
    }

    conversation.name = name;
    return this.conversationsRepository.save(conversation);
  }

  async remove(userId: number, id: number) {
    const conversation = await this.findOne(userId, id);
    if (!conversation) {
      throw new NotFoundException();
    }

    return await this.conversationsRepository.remove(conversation);
  }
}
