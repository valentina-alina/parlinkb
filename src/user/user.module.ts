/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { AppCacheModule } from '../cache/cache.module';

@Module({
  imports: [PrismaModule, AppCacheModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}