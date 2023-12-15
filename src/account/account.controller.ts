import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AccountService } from './account.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/role.decorator';
import { Role } from 'src/auth/role.enum';
import { RoleGuard } from 'src/auth/role.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth('JWT-auth')
@ApiTags("account")
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get("me")
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Default, Role.Moderator, Role.Admin)
  async test(@Req() req) {
    return req.user;
  }

  @Get("moderator")
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Moderator, Role.Admin)
  async testModerator(@Req() req) {
    return req.user;
  }

  @Get("admin")
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin)
  async testAdmin(@Req() req) {
    return req.user;
  }

}
