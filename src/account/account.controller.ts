import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AccountService } from './account.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/role.decorator';
import { Role } from 'src/auth/role.enum';
import { RoleGuard } from 'src/auth/role.guard';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin)
  async test(@Req() req) {
    return req.user;
  }

  // @Post()
  // create(@Body() createAccountDto: CreateAccountDto) {
  //   return this.accountService.create(createAccountDto);
  // }

  // @Get()
  // findAll() {
  //   return this.accountService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.accountService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
  //   return this.accountService.update(+id, updateAccountDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.accountService.remove(+id);
  // }
}
