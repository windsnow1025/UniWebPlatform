import { Body, Controller, Get, Put } from '@nestjs/common';
import { AnnouncementService } from './announcement.service';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { Announcement } from './announcement.entity';

@Controller('announcement')
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @Public()
  @Get()
  async find(): Promise<Announcement> {
    return this.announcementService.find();
  }

  @Put()
  @Roles([Role.Admin])
  async update(@Body() announcement: Announcement): Promise<Announcement> {
    return this.announcementService.update(announcement.content);
  }
}
