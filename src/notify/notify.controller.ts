import { HttpService } from '@nestjs/axios';
import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import axios from 'axios';
import { NotifyTelegramDto } from './dto/telegram-notify.dto';
import { ApiBody, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmailNotifyDto } from './dto/email-notify.dto';
import { MessageDto } from './dto/ok.dto';
import { NotifyService } from './notify.service';

@Controller('notify')
export class NotifyController {
  constructor(private readonly notifyService: NotifyService) {}
  
  @ApiOkResponse({
    type: MessageDto
  })
  @ApiBody({
    type: NotifyTelegramDto
  })
  @ApiParam({
    type: Number,
    name: 'id'
  })
  @Post('telegram/:id')
  async notifyTelegram(@Param('id', ParseIntPipe) id, @Body() dto: NotifyTelegramDto) {
    // const res = await axios.post('http://provider-service:666/tg/send', { 
    //   token: dto.token + '.' + id,
    //   message: dto.message,
    //  });
    // return res.data;
    return this.notifyService.notifyTelegram(id, dto);
  }

  @ApiOkResponse({
    type: MessageDto
  })
  @ApiBody({
    type: EmailNotifyDto
  })
  @Post('mail')
  async notifyEmail(@Body() dto: EmailNotifyDto) {
    // const company = await this.prisma.companyDetails.findFirst({ where: { id }, include: { account: true }})
    // const res = await axios.post('http://provider-service:666/mail/send', { 
    //   message: dto.message,
    //   producer_mail: company.account.email,
    //  });
    // return res.data;
    return this.notifyService.notifyEmail(dto);
  }
}
