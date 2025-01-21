import { Body, Controller, Get, Put } from '@nestjs/common';
import { AnnouncementService } from './announcement.service';
import { AnnouncementReqDto } from './dto/announcement.req.dto';
import { AnnouncementResDto } from './dto/announcement.res.dto';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('announcement')
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @Public()
  @Get()
  async find(): Promise<AnnouncementResDto> {
    return this.announcementService.find();
  }

  @Put()
  @Roles(Role.Admin)
  async update(
    @Body() announcementReqDto: AnnouncementReqDto,
  ): Promise<AnnouncementResDto> {
    return this.announcementService.update(announcementReqDto.content);
  }
}
