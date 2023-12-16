import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmailNotifyDto } from './dto/email-notify.dto';
import { MessageDto } from './dto/ok.dto';
import { NotifyTelegramDto } from './dto/telegram-notify.dto';
import axios from 'axios';

@Injectable()
export class NotifyService {
  constructor(private readonly prisma: PrismaService,
              private readonly httpService: HttpService) {}
  
  async notifyTelegram(id: number, dto: NotifyTelegramDto) : Promise<MessageDto> {
    const res = await axios.post('http://provider-service:666/tg/send', { 
      token: dto.token + '.' + id,
      message: dto.message,
     });
    return res.data;
  }

  async notifyEmail(id, dto: EmailNotifyDto) : Promise<MessageDto> {
    const company = await this.prisma.companyDetails.findFirst({ where: { id }, include: { account: true }})
    const res = await axios.post('http://provider-service:666/mail/send', { 
      message: dto.message,
      producer_mail: company.account.email,
     });
    return res.data;
  }  
}
