import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Announcement } from './announcement.entity';
import { AnnouncementResDto } from './dto/announcement.res.dto';

@Injectable()
export class AnnouncementService {
  constructor(
    @InjectRepository(Announcement)
    private readonly announcementRepository: Repository<Announcement>,
  ) {}

  private toAnnouncementDto(announcement: Announcement): AnnouncementResDto {
    return {
      content: announcement.content,
    };
  }

  async find(): Promise<AnnouncementResDto> {
    let announcement = await this.announcementRepository.findOneBy({});
    if (!announcement) {
      announcement = new Announcement();
      announcement.content = '';
      announcement = await this.announcementRepository.save(announcement);
    }
    return this.toAnnouncementDto(announcement);
  }

  async update(content: string): Promise<AnnouncementResDto> {
    let announcement = await this.announcementRepository.findOneBy({});
    if (!announcement) {
      announcement = new Announcement();
    }
    announcement.content = content;
    announcement = await this.announcementRepository.save(announcement);
    return this.toAnnouncementDto(announcement);
  }
}
