import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AccountService } from './account.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/role.decorator';
import { Role } from 'src/auth/role.enum';
import { RoleGuard } from 'src/auth/role.guard';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { TokenPayloadModel } from './entity/payload.entity';
import { PrismaService } from 'src/prisma/prisma.service';

@ApiBearerAuth('JWT-auth')
@ApiTags("account")
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService,
              private readonly prisma: PrismaService) {}

  @ApiOkResponse({
    type: TokenPayloadModel
  })
  @Get("me")
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Default, Role.Moderator, Role.Admin)
  async test(@Req() req) {
    const res = await this.prisma.account.findFirst({
      where: { id: req.user.sub },
      include: {
        user: {
          include: {
            company: true
          }
        }
      }
    });

    return {
      email: req.user.email,
      role: req.user.role,
      id: req.user.sub,
      user_id: res.user.id,
      company_id: res.user.company_id
    };
  }

  // @ApiOkResponse({
  //   type: TokenPayloadModel
  // })
  // @Get("moderator")
  // @UseGuards(AuthGuard, RoleGuard)
  // @Roles(Role.Moderator, Role.Admin)
  // async testModerator(@Req() req) {
  //   return {
  //     email: req.user.email,
  //     role: req.user.role,
  //     id: req.user.sub,
  //   };
  // }

  // @ApiOkResponse({
  //   type: TokenPayloadModel
  // })
  // @Get("admin")
  // @UseGuards(AuthGuard, RoleGuard)
  // @Roles(Role.Admin)
  // async testAdmin(@Req() req) {
  //   return {
  //     email: req.user.email,
  //     role: req.user.role,
  //     id: req.user.sub,
  //   };
  // }

}
