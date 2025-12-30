import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Conversation } from './conversation.entity';
import { UsersService } from '../users/users.service';
import {
  ConversationResDto,
  ConversationUpdateTimeResDto,
} from './dto/conversation.res.dto';
import { Message } from './message.entity';

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
      updatedAt: conversation.updatedAt,
      colorLabel: conversation.colorLabel,
      isPublic: conversation.isPublic,
      version: conversation.version,
    };
    return conversationDto;
  }

  private assertIfMatch(conversation: Conversation, ifMatch?: string) {
    if (!ifMatch) {
      return;
    }
    const current = `${conversation.version}`;
    if (ifMatch !== current) {
      throw new PreconditionFailedException('ETag mismatch');
    }
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
      order: { updatedAt: 'DESC' },
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

  async findPublicOne(id: number) {
    const conversation = await this.conversationsRepository.findOne({
      where: { id },
      relations: ['users'],
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (!conversation.isPublic) {
      throw new ForbiddenException();
    }

    return conversation;
  }

  async findUpdateTimes(
    userId: number,
  ): Promise<ConversationUpdateTimeResDto[]> {
    const conversations = await this.find(userId);

    return conversations.map((conversation) => ({
      id: conversation.id,
      updatedAt: conversation.updatedAt,
    }));
  }

  async create(
    userId: number,
    name: string,
    messages: Message[],
  ): Promise<Conversation> {
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const conversation = new Conversation();
    conversation.name = name;
    conversation.messages = messages;
    conversation.users = [user];
    return await this.conversationsRepository.save(conversation);
  }

  async cloneForSpecificUser(
    userId: number,
    id: number,
    targetUsername: string,
  ): Promise<Conversation> {
    const conversation = await this.findOne(userId, id);
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    const targetUser =
      await this.usersService.findOneByUsername(targetUsername);
    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    const newConversation = new Conversation();
    newConversation.name = conversation.name;
    newConversation.messages = conversation.messages;
    newConversation.users = [targetUser];

    return await this.conversationsRepository.save(newConversation);
  }

  async addUserForUsers(
    userId: number,
    conversationId: number,
    username: string,
    ifMatch?: string,
  ) {
    const conversation = await this.findOne(userId, conversationId);
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    this.assertIfMatch(conversation, ifMatch);

    const userToAdd = await this.usersService.findOneByUsername(username);
    if (!userToAdd) {
      throw new NotFoundException('User not found');
    }

    conversation.users.push(userToAdd);
    return await this.conversationsRepository.save(conversation);
  }

  async update(
    userId: number,
    id: number,
    name: string,
    messages: Message[],
    ifMatch?: string,
  ) {
    const conversation = await this.findOne(userId, id);
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    this.assertIfMatch(conversation, ifMatch);

    conversation.name = name;
    conversation.messages = messages;

    return await this.conversationsRepository.save(conversation);
  }

  async updateName(userId: number, id: number, name: string, ifMatch?: string) {
    const conversation = await this.findOne(userId, id);
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    this.assertIfMatch(conversation, ifMatch);

    conversation.name = name;

    return await this.conversationsRepository.save(conversation);
  }

  async updatePublic(
    userId: number,
    id: number,
    isPublic: boolean,
    ifMatch?: string,
  ) {
    const conversation = await this.findOne(userId, id);
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    this.assertIfMatch(conversation, ifMatch);

    conversation.isPublic = isPublic;
    return await this.conversationsRepository.save(conversation);
  }

  async updateColorLabel(
    userId: number,
    id: number,
    colorLabel: string,
    ifMatch?: string,
  ) {
    const conversation = await this.findOne(userId, id);
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    this.assertIfMatch(conversation, ifMatch);

    conversation.colorLabel = colorLabel;

    return await this.conversationsRepository.save(conversation);
  }

  async remove(userId: number, id: number): Promise<Conversation> {
    const conversation = await this.findOne(userId, id);
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    await this.conversationsRepository.delete(id);

    return conversation;
  }
}
