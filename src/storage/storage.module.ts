import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StorageController } from './storage.controller';

@Module({
  providers: [StorageService],
  imports: [PrismaModule],
  exports: [StorageService],
  controllers: [StorageController],
})
export class StorageModule {}
