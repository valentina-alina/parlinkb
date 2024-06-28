/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { AppCacheModule } from '../cache/cache.module';
import { AuthService } from '../auth/auth.service'

@Module({
  imports: [PrismaModule, AppCacheModule],
  controllers: [UserController],
  providers: [UserService,AuthService],
  exports: [UserService]
})
export class UserModule {}