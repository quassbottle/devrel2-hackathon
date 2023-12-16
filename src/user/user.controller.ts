import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpException, ParseIntPipe, Query, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UserModel } from './entities/user.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { AccountService } from 'src/account/account.service';
import { StorageService } from 'src/storage/storage.service';
import { CompanyModel } from 'src/company/entity/company.entity';
import { PrismaService } from 'src/prisma/prisma.service';

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
