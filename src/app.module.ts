import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { CompanyModule } from './company/company.module';
import { UserModule } from './user/user.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [PrismaModule, AccountModule, AuthModule, CompanyModule, UserModule, ServeStaticModule.forRoot({
    rootPath: join(__dirname,'swagger'),
    serveStaticOptions: {}
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
