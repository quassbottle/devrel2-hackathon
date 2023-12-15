import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { CompanyModule } from './company/company.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [PrismaModule, AccountModule, AuthModule, CompanyModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
