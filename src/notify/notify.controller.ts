import { HttpService } from '@nestjs/axios';
import { Body, Controller, Get } from '@nestjs/common';
import axios from 'axios';
import { NotifyTelegramDto } from './dto/telegram-notify.dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('notify')
export class NotifyController {
  constructor(private readonly httpService: HttpService) {}
  
  @ApiBody({
    type: NotifyTelegramDto
  })
  @Get('telegram')
  async notifyTelegram(@Body() dto: NotifyTelegramDto) {
    return (await axios.post('http://provider-service:666/tg/send', { ...dto })).data;
  }
}
