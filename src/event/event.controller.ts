import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpException, ParseIntPipe, HttpStatus, Put } from '@nestjs/common';
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
import { EventJoinModel } from './entities/event-join-request.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventJoinStatusDto } from './dto/change-join-status.dto';
import { ModerationStatus } from '@prisma/client';
import { NotifyService } from 'src/notify/notify.service';

@ApiBearerAuth('JWT-auth')
@ApiTags('event')
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService,
              private readonly storageService: StorageService,
              private readonly companyService: CompanyService,
              private readonly userService: UserService,
              private readonly prismaService: PrismaService,
              private readonly notifyService: NotifyService) {}
  
  @ApiParam({
    type: Number,
    name: 'id'
  })
  @ApiOkResponse({
    type: UserModel,
    isArray: true
  })
  @Get(':id/participants')
  async getParticipants(@Param('id', ParseIntPipe) id) {
    const candidate = await this.prismaService.event.findFirst({
      where: {
        id
      },
      include: {
        participants: {
          include: {
            avatar: true
          }
        }
      }
    });
    if (candidate == null) {
      throw new HttpException('Event not found', 404);
    }

    return candidate.participants;
  }
  
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
  @UseGuards(AuthGuard)
  @Post(':id/update-status')
  async updateStatus(@Param('id', ParseIntPipe) id, @Req() req, @Body() dto: EventChangeStatusDto) : Promise<EventModel> {
    const candidate = await this.eventService.event({ id });

    if (candidate == null) {
      throw new HttpException('Event not found', 404);
    }

    const own = await this.companyService.company({ account_id: req.user.sub });
    if (own == null) {
      throw new HttpException('You do not own a company', 400);
    }

    if (candidate.company_id != own.id && req.user.role != 'admin') {
      throw new HttpException('Event is not yours', HttpStatus.UNAUTHORIZED);
    }

    const res = await this.eventService.update({
      where: { id },
      data: {
        status: dto.status
      },
      include: {
        banner: true
      }
    });

    const host = await this.prismaService.companyDetails.findFirst({ where: { id: res.company_id}, include: { account: true } })

    if (host.notifications_tg_bot != null) {
      switch (res.status) {
        case 'running': {
          this.notifyService.notifyTelegram(host.id, {
            message: `Событие ${res.title} началось!`,
            token: host.notifications_tg_bot
          });
          
          break;
        }
        case 'completed': {
          this.notifyService.notifyTelegram(host.id, {
            message: `Событие ${res.title} завершилось!`,
            token: host.notifications_tg_bot
          });
          break;
        }
      }
    }
    
    switch (res.status) {
      case 'running': {
        this.notifyService.notifyEmail({
          message: `Событие ${res.title} началось!`,
          producer_mail: host.account.email
        });
        break;
      }
      case 'completed': {
        this.notifyService.notifyEmail({
          message: `Событие ${res.title} завершилось!`,
          producer_mail: host.account.email
        });
        break;
      }
    }


    return res;
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

    const host = await this.prismaService.companyDetails.findFirst({ where: { id: event.company_id}, include: { account: true } })

    if (host.notifications_tg_bot != null) {
      this.notifyService.notifyTelegram(host.id, {
        message: `Событие ${event.title} появилось!`,
        token: host.notifications_tg_bot
      });
    }
    this.notifyService.notifyEmail({
      message: `Событие ${event.title} появилось!`,
      producer_mail: host.account.email
    });

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
  @UseGuards(AuthGuard, RoleGuard)
  @Get(':id/force-join')
  @Roles(Role.Admin, Role.Moderator)
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

  @ApiParam({
    type: Number,
    name: 'id'
  })
  @ApiOkResponse({
    type: EventJoinModel
  })
  @UseGuards(AuthGuard)
  @Get(':id/join')
  async tryJoinEvent(@Param('id', ParseIntPipe) id, @Req() req) {
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

    const check2 = await this.eventService.events({
      where: {
        id: id,
        requests: {
          some: {
            id: req.user.sub
          }
        }
      }
    });

    if (check2.length > 0) throw new HttpException('You are already sent request to this event', 400); 

    const res = await this.prismaService.event.update({
      where: { id },
      data: {
        requests: {
          create: {
            user_id: req.user.sub
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

    return this.prismaService.eventJoin.findFirst({
      where: {
        event_id: id,
        user_id: req.user.sub
      }
    });
  }

  @ApiParam({
    type: Number,
    name: 'id'
  })
  @ApiOkResponse({
    type: EventJoinModel,
    isArray: true,
  })
  @UseGuards(AuthGuard)
  @Get(':id/requests')
  async getRequests(@Param('id', ParseIntPipe) id, @Req() req) {
    const candidate = await this.prismaService.event.findFirst({
      where: {
        id
      },
      include: {
        company: true
      }
    });
    
    if (candidate == null) {
      throw new HttpException('Event not found', 404);
    }

    if (candidate.company.account_id !== req.user.sub && req.user.role != 'admin') {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    if (candidate.company.account_id !== req.user.sub && req.user.role != 'moderator') {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
1
    return this.prismaService.eventJoin.findMany({
      where: {
        event_id: id
      }
    });
  }

  @ApiParam({
    type: Number,
    name: 'id'
  })
  @ApiOkResponse({
    type: EventJoinModel,
    isArray: true,
  })
  @UseGuards(AuthGuard)
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id, @Req() req, @Body() dto: UpdateEventDto) {
    const candidate = await this.eventService.event({ id });

    const { title, description, banner_id, starts_at, ends_at } = dto;
    
    if (candidate == null) {
      throw new HttpException('Event not found', 404);
    }

    if (candidate.company.account_id !== req.user.sub && req.user.role != 'admin') {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    if (candidate.company.account_id !== req.user.sub && req.user.role != 'moderator') {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
1
    return this.eventService.update({
      where: {
        id
      },
      data: {
        title,
        description,
        banner: {
          connect: {
            id: banner_id
          }
        },
        starts_at,
        ends_at,
      }
    })
  }

  @ApiParam({
    type: Number,
    name: 'id'
  })
  @ApiParam({
    type: Number,
    name: 'rq'
  })
  @ApiOkResponse({
    type: EventJoinModel,
    isArray: true,
  })
  @UseGuards(AuthGuard)
  @Post(':id/requests/:rq/status')
  async changeRequestStatus(@Param('id', ParseIntPipe) id, @Param('rq', ParseIntPipe) rq, @Req() req, @Body() dto: EventJoinStatusDto) {
    const candidate = await this.eventService.event({ id }, { requests: true, company: true });
    const candidateRequest = await this.prismaService.eventJoin.findFirst({
      where: {
        id: rq
      },
      include: {
        event: true
      }
    });
    
    if (candidate == null) {
      throw new HttpException('Event not found', 404);
    }
    if (candidateRequest == null) {
      throw new HttpException('Request not found', 404);
    }

    if (candidate.company.account_id !== req.user.sub && req.user.role != 'admin') {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    if (candidate.company.account_id !== req.user.sub && req.user.role != 'moderator') {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    if (dto.status == ModerationStatus.accepted) {
      // const check = await this.eventService.events({
      //   where: {
      //     id: id,
      //     participants: {
      //       some: {
      //         id: req.user.sub
      //       }
      //     }
      //   }
      // });
      const check = await this.prismaService.eventJoin.findMany({
        where: {
          id: rq,
          event_id: id
        }
      })
  
      if (check.length > 0 && check[0].status == 'accepted')
       throw new HttpException('User is already accepted', 400); 

      this.eventService.update({
        where: { id },
        data: {
          participants: {
            connect: {
              id: req.user.sub
            }
          }
        }
      });
    }
1
    return this.prismaService.eventJoin.update({
      where: {
        event_id: id,
        id: rq
      },
      data: {
        status: dto.status
      }
    });
  }
}
