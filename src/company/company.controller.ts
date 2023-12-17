import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Req, HttpException, HttpStatus, ParseUUIDPipe, Query, Put } from '@nestjs/common';
import { CompanyService } from './company.service';
import { ApiBearerAuth, ApiOkResponse, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { CompanyDetails, CompanyInvite, Prisma, UserDetails } from '@prisma/client';
import { CompanyCreateDto } from './dto/create-company.dto';
import { AccountService } from 'src/account/account.service';
import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/role.decorator';
import { RoleGuard } from 'src/auth/role.guard';
import { CompanyChangeStatusDto } from './dto/change-status.dto';
import { CompanyInviteDto } from './dto/company-invite.dto';
import { CompanyModel } from './entity/company.entity';
import { UserModel } from 'src/user/entities/user.entity';
import { CompanyInviteModel } from './entity/invite.entity';
import { UserService } from 'src/user/user.service';
import { StorageService } from 'src/storage/storage.service';
import { CompanyTgBotTokenDto } from './dto/tg-bot-token.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CompanyTokenModel as CompanyTokenModel } from './entity/company-token.entity';
import { CompanyUpdateDto } from './dto/company-update.dto';

@ApiTags('company')
@ApiBearerAuth('JWT-auth')
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService,
              private readonly accountService: AccountService,
              private readonly userService: UserService,
              private readonly storageService: StorageService,
              private readonly prisma: PrismaService) {}
  
  @ApiOkResponse({
    type: CompanyModel
  })
  @ApiParam({
    name: 'id',
    type: Number,
  })
  @UseGuards(AuthGuard)
  @Post(':id/unsubscribe')
  async unsubscribe(@Req() req, @Param('id', ParseIntPipe) id) {
    const res = await this.companyService.company({
      id
    });

    if (res == null) {
      throw new HttpException('Company not found', 404)
    }

    if ((await this.companyService.companies({
      where: {
        id: id,
        subscribers: {
          some: {
            id: req.user.sub
          }
        }
      }
    })).length == 0) throw new HttpException('You are not subscribed to this company', 400); 
    
    const subscribe = await this.userService.update({
      where: { id: req.user.sub },
      data: {
        subscribed_to: {
          disconnect: {
            id
          }
        }
      }
    });

    return this.companyService.company({ id });
  }

  @ApiOkResponse({
    type: CompanyModel
  })
  @ApiParam({
    name: 'id',
    type: Number,
  })
  @UseGuards(AuthGuard)
  @Post(':id/subscribe')
  async subscribe(@Req() req, @Param('id', ParseIntPipe) id) {
    const res = await this.companyService.company({
      id
    });

    if (res == null) {
      throw new HttpException('Company not found', 404)
    }

    if ((await this.companyService.companies({
      where: {
        id: id,
        subscribers: {
          some: {
            id: req.user.sub
          }
        }
      }
    })).length > 0) throw new HttpException('You are already subscribed to this company', 400); 
    
    const subscribe = await this.userService.update({
      where: { id: req.user.sub },
      data: {
        subscribed_to: {
          connect: {
            id
          }
        }
      }
    });

    return this.companyService.company({ id });
  }

  // @ApiOkResponse({
  //   type: CompanyModel
  // })
  // @ApiParam({
  //   name: 'id',
  //   type: String,
  //   format: 'uuid',
  // })
  // @Post('/join/:uuid')
  // @UseGuards(AuthGuard)
  // async join(@Req() req, @Param('uuid') uuid) : Promise<CompanyDetails> {
  //   const res = await this.companyService.invite({ uuid });

  //   if (res == null) {
  //     throw new HttpException('Invite not found', 404)
  //   }

  //   const account = await this.accountService.account({
  //     id: req.user.sub
  //   }, {
  //     user: true
  //   });

  //   if (account.company != null) {
  //     throw new HttpException('You already in a company', 400);
  //   }

  //   const result = await this.userService.update({
  //     where: { id: account.user.id },
  //     data: {
  //       company: {
  //         connect: {
  //           id: res.company_id
  //         }
  //       }
  //     },
  //     include: {
  //       company: true
  //     }
  //   });

  //   return result.company;
  // }

  // @ApiOkResponse({
  //   type: CompanyInviteModel
  // })
  // @Post('create-invite')
  // @UseGuards(AuthGuard)
  // async createInvite(@Req() req) : Promise<CompanyInvite> {
  //   const res = await this.companyService.company({
  //     account_id: req.user.sub
  //   });

  //   if (res == null) {
  //     throw new HttpException('Company not found', 404)
  //   }

  //   return this.companyService.createInvite({
  //     company: {
  //       connect: {
  //         id: res.id
  //       }
  //     }
  //   })
  // }

  // @ApiOkResponse({
  //   type: CompanyInviteModel
  // })
  // @ApiParam({
  //   name: 'id',
  //   type: String,
  //   format: 'uuid',
  // })
  // @Post('revoke-invite/:id')
  // @UseGuards(AuthGuard)
  // async revokeInvite(@Req() req, @Param('id') uuid) : Promise<CompanyInvite> {
  //   console.log(uuid);

  //   const res = await this.companyService.invite({ uuid: uuid });
    
  //   if (res == null) {
  //     throw new HttpException('Invite not found', 404)
  //   }

  //   return this.companyService.deleteInvite({ uuid });
  // }

  @ApiOkResponse({
    type: CompanyModel
  })
  @Get('own')
  @UseGuards(AuthGuard)
  async getOwn(@Req() req) : Promise<CompanyModel> {
    const res = await this.companyService.company({
      account_id: req.user.sub
    }, { avatar: true });

    if (res == null) {
      throw new HttpException('Company not found', 404)
    }

    return res;
  }

  @ApiOkResponse({
    type: CompanyModel
  })
  @ApiParam({
    name: 'id',
    type: Number,
  })
  @Get(':id')
  async get(@Param('id', ParseIntPipe) id) {
    const res =  await this.prisma.companyDetails.findMany({
      select: {
        title: true,
        description: true,
        avatar: true,
        avatar_id: true,
        id: true,
        city: true,
        status: true, 
        account_id: true
      }
    });
    
    if (res == null) {
      throw new HttpException('Company not found', 404)
    }

    return res[0];
  }

  @ApiOkResponse({
    type: CompanyModel
  })
  @ApiParam({
    name: 'id',
    type: Number,
  })
  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id, @Req() req) : Promise<CompanyDetails> {
    const company = await this.companyService.company({ id: id });

    if (company == null) {
      throw new HttpException('Company not found', 404);
    }

    if (company.account_id !== req.user.sub && req.user.role != 'admin') {
      throw new HttpException('This company is not yours', HttpStatus.FORBIDDEN);
    }

    return this.companyService.delete({ id: id });
  }

  @ApiOkResponse({
    type: CompanyModel
  })
  @ApiParam({
    name: 'id',
    type: Number,
  })
  @Post(':id/status')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin, Role.Moderator)
  async changeStatus(@Param('id', ParseIntPipe) id, @Req() req, @Body() statusDto: CompanyChangeStatusDto) : Promise<CompanyDetails> {
    const company = await this.companyService.company({ id });

    if (company == null) {
      throw new HttpException('Company not found', 404);
    }

    return this.companyService.updateCompany({
      where: {
        id: id
      },
      data: {
        status: statusDto.status
      }
    })
  }

  @ApiOkResponse({
    type: UserModel,
    isArray: true,
  })
  @ApiParam({
    name: 'id',
    type: Number,
  })
  @Get(':id/employees')
  async getEmployees(@Param('id', ParseIntPipe) id) : Promise<UserDetails[]> {
    const company = await this.companyService.company({ id }, { employees: true });

    if (company == null) {
      throw new HttpException('Company not found', 404);
    }

    const owner = await this.accountService.account({ id: company.account_id }, { user: true });

    return company.employees;
  }

  @ApiOkResponse({
    type: CompanyModel,
  })
  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() create: CompanyCreateDto, @Req() req) : Promise<CompanyModel> {
    const { title, description, city, avatar_id } = create;
    const id = req.user.sub;

    const candidate = await this.companyService.company({
      account_id: id
    });

    if (candidate) throw new HttpException('You already own a company', 400);

    const companyCreate = await this.accountService.update({
      where: {
        id
      },
      data: {
        company: {
          create: {
            title, description, city, avatar: {
              connect: {
                id: avatar_id
              }
            }
          }
        }
      },
      include: {
        company: true
      }
    });

    const res = await this.accountService.update({
      where: {
        id
      },
      data: {
        user: {
          update: {
            company_id: companyCreate.company.id
          }
        }
      },
      include: {
        company: true
      }
    });

    const avatar = await this.storageService.file({ id: res.company.avatar_id });

    return { ...res.company, avatar };
  }

  @ApiOkResponse({
    type: CompanyModel,
    isArray: true,
  })
  // @ApiQuery({
  //   name: 'page',
  //   type: Number
  // })
  @Get()
  async getAll(/*@Query('page', ParseIntPipe) page*/) {
    // page = Math.max(1, page);

    // return this.userService.users({
    //   take: 10,
    //   skip: 10 * (page - 1)
    // })
    return this.prisma.companyDetails.findMany({
      select: {
        title: true,
        description: true,
        avatar: true,
        avatar_id: true,
        id: true,
        city: true,
        status: true, 
        account_id: true
      }
    });
    //return this.companyService.companies({ include: { avatar: true }} );
  }

  @ApiParam({
    name: 'id',
    type: Number,
  })
  @ApiResponse({
    type: CompanyTokenModel
  })
  @UseGuards(AuthGuard)
  @Post(':id/set-bot-token')
  async setBotToken(@Req() req, @Param('id', ParseIntPipe) id, @Body() dto: CompanyTgBotTokenDto) {
    const { token } = dto;

    const company = await this.companyService.company({
      id
    });

    if (company == null) {
      throw new HttpException('Company not found', 404);
    }

    if (company.account_id !== req.user.sub && req.user.role != 'admin') {
      throw new HttpException('This company is not yours', HttpStatus.FORBIDDEN);
    }

    return this.prisma.companyDetails.update({
      where: { id },
      data: {
        notifications_tg_bot: token
      },
      include: {
        avatar: true
      }
    });
  }

  @ApiOkResponse({
    type: CompanyModel
  })
  @ApiParam({
    name: 'id',
    type: Number,
  })
  @UseGuards(AuthGuard)
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id, @Body() dto: CompanyUpdateDto, @Req() req) : Promise<CompanyModel> {
    const res = await this.prisma.companyDetails.findFirst({ where: { id }});

    if (res.account_id !== req.user.sub && req.user.role != 'admin') {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const { title, description, avatar_id, city } = dto;
    
    if (res == null) {
      throw new HttpException('Company not found', 404)
    }

    const updated = await this.prisma.companyDetails.update({
      where: { id },
      data: {
        avatar: {
          connect: {
            id: avatar_id
          }
        },
        title,
        description,
        city,
      },
      include: {
        avatar: true,
      }
    });
    
    return {
      id: updated.id,
      title: updated.title,
      description: updated.description,
      city: updated.city,
      avatar_id: updated.avatar_id,
      avatar: { ...updated.avatar },
      status: updated.status,
      account_id: updated.account_id,
    }
  }
}
