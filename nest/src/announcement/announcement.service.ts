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

  public toAnnouncementDto(announcement: Announcement) {
    const announcementDto: AnnouncementResDto = {
      id: announcement.id,
      content: announcement.content,
    };
    return announcementDto;
  }

  async find(): Promise<Announcement> {
    let announcement = await this.announcementRepository.findOneBy({});
    if (!announcement) {
      announcement = new Announcement();
      announcement.content = '';
      announcement = await this.announcementRepository.save(announcement);
    }
    return announcement;
  }

  async update(content: string): Promise<Announcement> {
    let announcement = await this.announcementRepository.findOneBy({});
    if (!announcement) {
      announcement = new Announcement();
    }
    announcement.content = content;
    return await this.announcementRepository.save(announcement);
  }
}
