import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AccountModule } from 'src/account/account.module';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService],
  imports: [PrismaModule, AccountModule, UserModule]
})
export class CompanyModule {}
