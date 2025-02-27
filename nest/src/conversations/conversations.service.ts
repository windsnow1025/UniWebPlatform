import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Conversation } from './conversation.entity';
import { UsersService } from '../users/users.service';
import { ConversationResDto } from './dto/conversation.res.dto';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private conversationsRepository: Repository<Conversation>,
    private usersService: UsersService,
  ) {}

  public toConversationDto(conversation: Conversation) {
    const conversationDto: ConversationResDto = {
      id: conversation.id,
      name: conversation.name,
      messages: conversation.messages,
      users: conversation.users.map(this.usersService.toUserDto),
    };
    return conversationDto;
  }

  async find(userId: number) {
    const conversationIds = await this.conversationsRepository
      .createQueryBuilder('conversation')
      .leftJoin('conversation.users', 'user')
      .where('user.id = :userId', { userId })
      .select('conversation.id')
      .getMany();

    const ids = conversationIds.map((conversation) => conversation.id);

    if (ids.length === 0) {
      return [];
    }

    return this.conversationsRepository.find({
      where: { id: In(ids) },
      relations: ['users'],
    });
  }

  async findOne(userId: number, id: number) {
    const conversation = await this.conversationsRepository.findOne({
      where: { id },
      relations: ['users'],
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    const userInConversation = conversation.users.find(
      (user) => user.id === userId,
    );
    if (!userInConversation) {
      throw new ForbiddenException();
    }

    return conversation;
  }

  async create(userId: number, conversation: Conversation) {
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    conversation.users = [user];
    return await this.conversationsRepository.save(conversation);
  }

  async createForUser(userId: number, id: number, username: string) {
    const conversation = await this.findOne(userId, id);
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    const targetUser = await this.usersService.findOneByUsername(username);
    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    return await this.conversationsRepository.save({
      name: conversation.name,
      messages: conversation.messages,
      users: [targetUser],
    });
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

  async updateUsers(userId: number, conversationId: number, username: string) {
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

  async remove(userId: number, id: number) {
    const conversation = await this.findOne(userId, id);
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return await this.conversationsRepository.remove(conversation);
  }
}
