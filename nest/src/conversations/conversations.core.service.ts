import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Conversation } from './conversation.entity';

@Injectable()
export class ConversationsCoreService {
  constructor(
    @InjectRepository(Conversation)
    private conversationsRepository: Repository<Conversation>,
  ) {}

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

  async deleteOrphansByUserId(userId: number): Promise<void> {
    const conversations = await this.find(userId);
    const orphans = conversations.filter(
      (conversation) => conversation.users.length === 1,
    );

    for (const orphan of orphans) {
      await this.conversationsRepository.delete(orphan.id);
    }
  }
}
