import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StorageModule } from 'src/storage/storage.module';
import { CompanyModel } from 'src/company/entity/company.entity';
import { CompanyModule } from 'src/company/company.module';
import { UserModule } from 'src/user/user.module';
import { NotifyModule } from 'src/notify/notify.module';

@Module({
  controllers: [EventController],
  providers: [EventService],
  imports: [PrismaModule, StorageModule, CompanyModule, UserModule, NotifyModule]
})
export class EventModule {}
