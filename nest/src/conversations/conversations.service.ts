import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './conversation.entity';
import { UsersService } from '../users/users.service';
import { ConversationDto } from './dto/conversation.dto';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private conversationsRepository: Repository<Conversation>,
    private usersService: UsersService,
  ) {}

  public toConversationDto(conversation: Conversation) {
    const conversationDto: ConversationDto = {
      id: conversation.id,
      name: conversation.name,
      messages: conversation.messages,
      users: conversation.users.map(this.usersService.toUserDto),
    };
    return conversationDto;
  }

  find(userId: number) {
    return this.conversationsRepository
      .createQueryBuilder('conversation')
      .leftJoinAndSelect('conversation.users', 'user')
      .where('user.id = :userId', { userId })
      .getMany();
  }

  async findOne(userId: number, id: number) {
    return this.conversationsRepository.findOne({
      where: {
        id,
        users: { id: userId },
      },
      relations: ['users'],
    });
  }

  async create(userId: number, conversation: Conversation) {
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    conversation.users = [user];
    return await this.conversationsRepository.save(conversation);
  }

  async addUser(userId: number, conversationId: number, username: string) {
    const conversation = await this.findOne(userId, conversationId);
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    const userToAdd = await this.usersService.findOneByUsername(username);
    if (!userToAdd) {
      throw new NotFoundException('User not found');
    }

    conversation.users.push(userToAdd);
    return await this.conversationsRepository.save(conversation);
  }

  async update(userId: number, newConversation: Conversation) {
    const conversation = await this.findOne(userId, newConversation.id);
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    conversation.name = newConversation.name;
    conversation.messages = newConversation.messages;

    return await this.conversationsRepository.save(conversation);
  }

  async updateName(userId: number, id: number, name: string) {
    const conversation = await this.findOne(userId, id);
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    conversation.name = name;

    return await this.conversationsRepository.save(conversation);
  }

  async remove(userId: number, id: number) {
    const conversation = await this.findOne(userId, id);
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return await this.conversationsRepository.remove(conversation);
  }
}
