import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AccountModule } from 'src/account/account.module';
import { StorageModule } from 'src/storage/storage.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [PrismaModule, AccountModule, StorageModule],
  exports: [UserService],
})
export class UserModule {}
