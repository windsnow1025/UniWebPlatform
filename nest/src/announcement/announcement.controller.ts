import { Body, Controller, Get, Put } from '@nestjs/common';
import { AnnouncementService } from './announcement.service';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { AnnouncementReqDto } from './dto/announcement.req.dto';
import { AnnouncementResDto } from './dto/announcement.res.dto';

@Controller('announcement')
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @Public()
  @Get()
  async find(): Promise<AnnouncementResDto> {
    const announcement = await this.announcementService.find();
    return this.announcementService.toAnnouncementDto(announcement);
  }

  @Put()
  @Roles([Role.Admin])
  async update(
    @Body() reqDto: AnnouncementReqDto,
  ): Promise<AnnouncementResDto> {
    const announcement = await this.announcementService.update(reqDto.content);
    return this.announcementService.toAnnouncementDto(announcement);
  }
}
