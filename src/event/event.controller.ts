import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpException, ParseIntPipe } from '@nestjs/common';
import { EventService } from './event.service';
import { EventCreateDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ApiBearerAuth, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { EventModel } from './entities/event.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { StorageService } from 'src/storage/storage.service';
import { CompanyService } from 'src/company/company.service';
import { ImageModel } from 'src/storage/entity/image.entity';
import { EventChangeStatusDto } from './dto/change-status.dto';
import { RoleGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/role.decorator';
import { Role } from 'src/auth/role.enum';
import { UserModel } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@ApiBearerAuth('JWT-auth')
@ApiTags('event')
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService,
              private readonly storageService: StorageService,
              private readonly companyService: CompanyService,
              private readonly userService: UserService) {}
  
  
  
  @ApiParam({
    type: Number,
    name: 'id'
  })
  @ApiOkResponse({
    type: EventModel
  })
  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id) {
    return this.eventService.event({ id });
  }

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
  @ApiParam({
    type: Number,
    name: 'id'
  })
  @UseGuards(AuthGuard, RoleGuard)
  @Post(':id/update-status')
  @Roles(Role.Admin, Role.Moderator)
  async updateStatus(@Param('id', ParseIntPipe) id, @Req() req, @Body() dto: EventChangeStatusDto) : Promise<EventModel> {
    const candidate = await this.eventService.event({ id });
    
    if (candidate == null) {
      throw new HttpException('Event not found', 404);
    }

    return this.eventService.update({
      where: { id },
      data: {
        status: dto.status
      },
      include: {
        banner: true
      }
    });
  }
  
  @ApiOkResponse({
    type: EventModel
  })
  @UseGuards(AuthGuard)
  @Post()
  async create(@Req() req, @Body() dto: EventCreateDto): Promise<EventModel> {
    const { title, description, banner_id, starts_at, ends_at } = dto;

    const banner = await this.storageService.file({ id: banner_id });

    if (banner == null) {
      throw new HttpException('Invalid banner', 404);
    }

    const company = await this.companyService.company({
      account_id: req.user.sub
    });

    if (company == null) {
      throw new HttpException('You do not own a company', 400);
    }

    const event = await this.eventService.create({
      title,
      description,
      starts_at,
      ends_at,
      company: {
        connect: {
          id: company.id
        }
      },
      banner: {
        connect: {
          id: banner_id
        }
      }
    })

    return {
      ...event, banner
    };
  }
  
  @ApiParam({
    type: Number,
    name: 'id'
  })
  @ApiOkResponse({
    type: EventModel
  })
  @UseGuards(AuthGuard)
  @Get(':id/leave')
  async leaveEvent(@Param('id', ParseIntPipe) id, @Req() req) {
    const candidate = await this.eventService.event({ id });
    
    if (candidate == null) {
      throw new HttpException('Event not found', 404);
    }

    if ((await this.eventService.events({
      where: {
        id: id,
        participants: {
          some: {
            id: req.user.sub
          }
        }
      }
    })).length == 0) throw new HttpException('You are not participating this event', 400); 

    const res = await this.eventService.update({
      where: { id },
      data: {
        participants: {
          disconnect: {
            id: req.user.sub
          }
        }
      },
      include: {
        participants: {
          include: {
            avatar: true
          }
        }
      }
    });

    return res;
  }

  @ApiParam({
    type: Number,
    name: 'id'
  })
  @ApiOkResponse({
    type: EventModel
  })
  @UseGuards(AuthGuard)
  @Get(':id/join')
  async joinEvent(@Param('id', ParseIntPipe) id, @Req() req) {
    const candidate = await this.eventService.event({ id });
    
    if (candidate == null) {
      throw new HttpException('Event not found', 404);
    }
1
    const check = await this.eventService.events({
      where: {
        id: id,
        participants: {
          some: {
            id: req.user.sub
          }
        }
      }
    });


    if (check.length > 0) throw new HttpException('You are already participating this event', 400); 

    const res = await this.eventService.update({
      where: { id },
      data: {
        participants: {
          connect: {
            id: req.user.sub
          }
        }
      },
      include: {
        participants: {
          include: {
            avatar: true
          }
        }
      }
    });

    return res;
  }

  @ApiParam({
    type: Number,
    name: 'id'
  })
  @ApiOkResponse({
    type: EventModel
  })
  @UseGuards(AuthGuard)
  @Get(':id/unfavorite')
  async unfavorite(@Param('id', ParseIntPipe) id, @Req() req) {
    const candidate = await this.eventService.event({ id });
    
    if (candidate == null) {
      throw new HttpException('Event not found', 404);
    }

    if ((await this.eventService.events({
      where: {
        id: id,
        saved_by: {
          some: {
            id: req.user.sub
          }
        }
      }
    })).length == 0) throw new HttpException('This event is not favorite', 400); 

    const res = await this.eventService.update({
      where: { id },
      data: {
        saved_by: {
          disconnect: {
            id: req.user.sub
          }
        }
      },
      include: {
        saved_by: {
          include: {
            avatar: true
          }
        }
      }
    });

    return res;
  }

  @ApiParam({
    type: Number,
    name: 'id'
  })
  @ApiOkResponse({
    type: EventModel
  })
  @UseGuards(AuthGuard)
  @Get(':id/favorite')
  async favorite(@Param('id', ParseIntPipe) id, @Req() req) {
    const candidate = await this.eventService.event({ id });
    
    if (candidate == null) {
      throw new HttpException('Event not found', 404);
    }
1
    const check = await this.eventService.events({
      where: {
        id: id,
        saved_by: {
          some: {
            id: req.user.sub
          }
        }
      }
    });


    if (check.length > 0) throw new HttpException('This event is already favorite', 400); 

    const res = await this.eventService.update({
      where: { id },
      data: {
        saved_by: {
          connect: {
            id: req.user.sub
          }
        }
      },
      include: {
        saved_by: {
          include: {
            avatar: true
          }
        }
      }
    });

    return res;
  }
}
