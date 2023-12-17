import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpException, ParseIntPipe, Query, UseGuards, Req, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UserModel } from './entities/user.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { AccountService } from 'src/account/account.service';
import { StorageService } from 'src/storage/storage.service';
import { CompanyModel } from 'src/company/entity/company.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserUpdateDto } from './dto/user-update.dto';
import { EventModel } from 'src/event/entities/event.entity';

@ApiTags('user')
@Controller('user')
@ApiBearerAuth('JWT-auth')
export class UserController {
  constructor(private readonly userService: UserService,
              private readonly accountService: AccountService,
              private readonly storageService: StorageService,
              private readonly prisma: PrismaService) {}

  @ApiOkResponse({
    type: CompanyModel,
    isArray: true
  })
  @UseGuards(AuthGuard)
  @Get('me/subscriptions')
  async getSubscriptions(@Req() req) : Promise<CompanyModel[]> {
    const id = req.user.sub;

    const candidate = await this.accountService.account({ id }, { user: true });
    const subs = await this.userService.user({ id: candidate.user.id }, { subscribed_to: { include: { avatar: true }} });

    return subs.subscribed_to;
  }

  @ApiOkResponse({
    type: EventModel,
    isArray: true
  })
  @UseGuards(AuthGuard)
  @Get('me/favorite')
  async getFavorite(@Req() req) : Promise<EventModel[]> {
    const id = req.user.sub;

    const candidate = await this.accountService.account({ id }, { user: true });
    const subs = await this.userService.user({ id: candidate.user.id }, { saved_events: { include: { banner: true }} });

    return subs.saved_events;
  }

  @ApiOkResponse({
    type: CompanyModel,
    isArray: true
  })
  @UseGuards(AuthGuard)
  @Get('me/requests')
  async getRequests(@Req() req) : Promise<CompanyModel[]> {
    const id = req.user.sub;

    const candidate = await this.accountService.account({ id }, { user: true });
    const subs = await this.userService.user({ id: candidate.user.id }, { subscribed_to: { include: { avatar: true }} });

    return subs.subscribed_to;
  }

  @ApiOkResponse({
    type: UserModel
  })
  @UseGuards(AuthGuard)
  @Get('me')
  async getMe(@Req() req) : Promise<UserModel> {
    const id = req.user.sub;

    const candidate = await this.accountService.account({ id }, { user: true });
    const avatar = candidate.user.avatar_id != null ? await this.storageService.file({ id: candidate.user.avatar_id }) : null;

    return { ...candidate.user, avatar };
  }

  @ApiOkResponse({
    type: UserModel
  })
  @ApiParam({
    name: 'id',
    type: Number,
  })
  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id) {
    return this.userService.user({ id: id }, { avatar: true })
  }

  @ApiOkResponse({
    type: UserModel
  })
  @ApiParam({
    name: 'id',
    type: Number,
  })
  @UseGuards(AuthGuard)
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id, @Body() dto: UserUpdateDto, @Req() req) : Promise<UserModel> {
    const res = await this.prisma.userDetails.findFirst({ where: { id }});

    if (res.account_id !== req.user.sub && req.user.role != 'admin') {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const { first_name, last_name, middle_name, birthdate, avatar_id, city, username, github_url, telegram } = dto;
    
    if (res == null) {
      throw new HttpException('User not found', 404)
    }

    const candidateUser = await this.userService.user({
      username: username
    });

    if (candidateUser) throw new HttpException('User with such username already exists', 400);

    const updated = await this.prisma.userDetails.update({
      where: { id },
      data: {
        avatar: {
          connect: {
            id: avatar_id
          }
        },
        first_name,
        middle_name,
        last_name,
        birthdate,
        city,
        username,
        telegram,
      },
      include: {
        avatar: true,
      }
    });
    
    return {
      id: updated.id,
      first_name: updated.first_name,
      middle_name: updated.middle_name,
      last_name: updated.last_name,
      birthdate: updated.birthdate,
      city: updated.city,
      avatar_id: updated.avatar_id,
      avatar: { ...updated.avatar },
      account_id: updated.account_id,
      created_at: updated.created_at,
      company_id: updated.company_id,
      username: updated.username,
      github_url: updated.github_url,
      telegram: updated.telegram
    }
  }

  @ApiOkResponse({
    type: UserModel,
    isArray: true,
  })
  // @ApiQuery({
  //   name: 'page',
  //   type: Number
  // })
  @Get()
  async getAll() {
    return this.userService.users({ include: { avatar: true }});
  }
  // async getAll(@Query('page', ParseIntPipe) page) {
  //   page = Math.max(1, page);

  //   return this.userService.users({
  //     take: 10,
  //     skip: 10 * (page - 1)
  //   })
  // }
}
