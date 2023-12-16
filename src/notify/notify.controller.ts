import { HttpService } from '@nestjs/axios';
import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import axios from 'axios';
import { NotifyTelegramDto } from './dto/telegram-notify.dto';
import { ApiBody, ApiParam } from '@nestjs/swagger';

@Controller('notify')
export class NotifyController {
  constructor(private readonly httpService: HttpService) {}
  
  @ApiBody({
    type: NotifyTelegramDto
  })
  @ApiParam({
    type: Number,
    name: 'id'
  })
  @Post('telegram/:id')
  async notifyTelegram(@Param('id', ParseIntPipe) id, @Body() dto: NotifyTelegramDto) {
    const res = await axios.post('http://provider-service:666/tg/send', { 
      token: dto.token + '.' + id,
      message: dto.message,
     });
    return res.data;
  }
}
