import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpException, ParseIntPipe, Query, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UserModel } from './entities/user.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { AccountService } from 'src/account/account.service';

@ApiTags('user')
@Controller('user')
@ApiBearerAuth('JWT-auth')
export class UserController {
  constructor(private readonly userService: UserService,
              private readonly accountService: AccountService) {}

  @ApiOkResponse({
    type: UserModel
  })
  @UseGuards(AuthGuard)
  @Get('me')
  async getMe(@Req() req) {
    const id = req.user.sub;

    const candidate = await this.accountService.account({ id }, {user: true})

    return candidate.user;
  }

  @ApiOkResponse({
    type: UserModel
  })
  @ApiParam({
    name: 'id',
    type: Number,
  })
  @Get(':id')
  async getById(@Param('id') id) {
    return this.userService.user({ id: id })
  }

  @ApiOkResponse({
    type: UserModel,
    isArray: true,
  })
  @ApiQuery({
    name: 'page',
    type: Number
  })
  @Get()
  async getAll(@Query('page', ParseIntPipe) page) {
    page = Math.max(1, page);

    return this.userService.users({
      take: 10,
      skip: 10 * (page - 1)
    })
  }
}
