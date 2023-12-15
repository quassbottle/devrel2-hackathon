import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [AccountController],
  providers: [AccountService],
  imports: [PrismaModule],
  exports: [AccountService],
})
export class AccountModule {}
