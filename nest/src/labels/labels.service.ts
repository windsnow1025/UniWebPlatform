import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Label } from './label.entity';
import { UsersCoreService } from '../users/users.core.service';
import { LabelsCoreService } from './labels.core.service';

@Injectable()
export class LabelsService {
  constructor(
    @InjectRepository(Label)
    private labelsRepository: Repository<Label>,
    private usersCoreService: UsersCoreService,
    private labelsCoreService: LabelsCoreService,
  ) {}

  async find(userId: number): Promise<Label[]> {
    return this.labelsRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
      order: { name: 'ASC' },
    });
  }

  async create(userId: number, name: string, color: string): Promise<Label> {
    const user = await this.usersCoreService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const label = new Label();
    label.name = name;
    label.color = color;
    label.user = user;

    return await this.labelsRepository.save(label);
  }

  async update(
    userId: number,
    id: number,
    name: string,
    color: string,
  ): Promise<Label> {
    const label = await this.labelsCoreService.findOne(userId, id);

    label.name = name;
    label.color = color;

    return await this.labelsRepository.save(label);
  }

  async delete(userId: number, id: number): Promise<Label> {
    const label = await this.labelsCoreService.findOne(userId, id);

    const result = await this.labelsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Label not deleted');
    }

    return label;
  }
}
