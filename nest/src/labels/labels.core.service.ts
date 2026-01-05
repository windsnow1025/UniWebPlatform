import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Label } from './label.entity';
import { LabelResDto } from './dto/label.res.dto';

@Injectable()
export class LabelsCoreService {
  constructor(
    @InjectRepository(Label)
    private labelsRepository: Repository<Label>,
  ) {}

  public toLabelDto(label: Label): LabelResDto {
    return {
      id: label.id,
      name: label.name,
      color: label.color,
    };
  }

  async findOne(userId: number, id: number): Promise<Label> {
    const label = await this.labelsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!label) {
      throw new NotFoundException('Label not found');
    }

    if (label.user.id !== userId) {
      throw new ForbiddenException();
    }

    return label;
  }
}
