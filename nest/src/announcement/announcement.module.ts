import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Announcement } from './announcement.entity';
import { AnnouncementService } from './announcement.service';
import { AnnouncementController } from './announcement.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Announcement])],
  providers: [AnnouncementService],
  controllers: [AnnouncementController],
  exports: [],
})
export class AnnouncementModule {}
