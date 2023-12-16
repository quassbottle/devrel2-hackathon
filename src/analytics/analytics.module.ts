import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [AnalyticsController],
  imports: [HttpModule]
})
export class AnalyticsModule {}
