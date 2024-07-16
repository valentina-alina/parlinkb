/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';

import { UserController } from './user.controller';
import { UserService } from './user.service';

import { PrismaModule } from '../../prisma/prisma.module';
import { AppCacheModule } from '../cache/cache.module';

import { AuthService } from '../auth/auth.service'
import { ChildService } from '../child/child.service'
import { UserHasChildService } from '../child/userHasChild.service';
import { SubjectService } from '../subject/subject.service';
import { UserHasSubjectService } from '../userHasSubject/userHasSubject.service';


@Module({
  imports: [PrismaModule, AppCacheModule],
  controllers: [UserController],
  providers: [UserService,AuthService,ChildService,UserHasChildService,SubjectService,UserHasSubjectService],
  exports: [UserService]
})
export class UserModule {}