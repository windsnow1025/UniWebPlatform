import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './conversation.entity';
import { UsersService } from '../users/users.service';
import { UserDto } from '../users/dto/user.dto';
import { User } from '../users/user.entity';
import { ConversationDto } from './dto/conversation.dto';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private conversationsRepository: Repository<Conversation>,
    private usersService: UsersService,
  ) {}

  private toUserDto(user: User) {
    const userDto: UserDto = {
      id: user.id,
      username: user.username,
      roles: user.roles,
      credit: user.credit,
    };
    return userDto;
  }

  private toConversationDto(conversation: Conversation) {
    const conversationDto: ConversationDto = {
      id: conversation.id,
      name: conversation.name,
      messages: conversation.messages,
      users: conversation.users.map(this.toUserDto),
    };
    return conversationDto;
  }

  async find(userId: number) {
    const conversations = await this.conversationsRepository
      .createQueryBuilder('conversation')
      .leftJoinAndSelect('conversation.users', 'user')
      .where('user.id = :userId', { userId })
      .getMany();

    return conversations.map((conversation) =>
      this.toConversationDto(conversation),
    );
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
    const savedConversation =
      await this.conversationsRepository.save(conversation);
    return this.toConversationDto(savedConversation);
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
    const updatedConversation =
      await this.conversationsRepository.save(conversation);
    return this.toConversationDto(updatedConversation);
  }

  async update(userId: number, newConversation: Conversation) {
    const conversation = await this.findOne(userId, newConversation.id);
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    conversation.name = newConversation.name;
    conversation.messages = newConversation.messages;

    const updatedConversation =
      await this.conversationsRepository.save(conversation);
    return this.toConversationDto(updatedConversation);
  }

  async updateName(userId: number, id: number, name: string) {
    const conversation = await this.findOne(userId, id);
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    conversation.name = name;
    const updatedConversation =
      await this.conversationsRepository.save(conversation);
    return this.toConversationDto(updatedConversation);
  }

  async remove(userId: number, id: number) {
    const conversation = await this.findOne(userId, id);
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return await this.conversationsRepository.remove(conversation);
  }
}
