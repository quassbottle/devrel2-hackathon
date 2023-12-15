import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpException, ParseIntPipe, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getById(@Param('id') id) {
    return this.userService.user({ id: id })
  }

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
