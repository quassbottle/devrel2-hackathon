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
import { StorageService } from './storage/storage.service';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [
    PrismaModule,
    AccountModule,
    AuthModule,
    CompanyModule,
    UserModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'swagger'),
      serveStaticOptions: {}
    }),
    StorageModule
  ],
  controllers: [AppController],
  providers: [AppService, StorageService],
})
export class AppModule {}
