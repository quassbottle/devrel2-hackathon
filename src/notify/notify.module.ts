import { Module } from '@nestjs/common';
import { NotifyController } from './notify.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [NotifyController]
})
export class NotifyModule {}
