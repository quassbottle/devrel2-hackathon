import { Module } from '@nestjs/common';
import { NotifyController } from './notify.controller';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from 'src/prisma/prisma.module';
import { NotifyService } from './notify.service';

@Module({
  imports: [HttpModule, PrismaModule],
  controllers: [NotifyController],
  providers: [NotifyService],
  exports: [NotifyService]
})
export class NotifyModule {}
