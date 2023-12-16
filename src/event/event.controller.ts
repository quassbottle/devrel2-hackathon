import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpException } from '@nestjs/common';
import { EventService } from './event.service';
import { EventCreateDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { EventModel } from './entities/event.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { StorageService } from 'src/storage/storage.service';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService,
              private readonly storageService: StorageService) {}

  @ApiOkResponse({
    type: EventModel
  })
  @Get()
  async getAll() {
    return this.eventService.events({});
  }
  
  @ApiOkResponse({
    type: EventModel
  })
  @UseGuards(AuthGuard)
  @Post()
  async create(@Req() req, @Body() dto: EventCreateDto): Promise<EventModel[]> {
    const { title, description, banner_id } = dto;

    const banner = await this.storageService.file({ id: banner_id });

    if (banner == null) {
      throw new HttpException('Invalid banner', 404);
    }

    return null;

    // return this.eventService.create({
    //   title: title,
    //   description: description,
      
    // })
  }
}
