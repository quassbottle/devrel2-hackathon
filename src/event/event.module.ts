import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StorageModule } from 'src/storage/storage.module';

@Module({
  controllers: [EventController],
  providers: [EventService],
  imports: [PrismaModule, StorageModule]
})
export class EventModule {}
