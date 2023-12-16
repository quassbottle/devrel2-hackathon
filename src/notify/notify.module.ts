import { Module } from '@nestjs/common';
import { NotifyController } from './notify.controller';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [HttpModule, PrismaModule],
  controllers: [NotifyController]
})
export class NotifyModule {}
