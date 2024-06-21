/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UserHasSubjectService } from './userHasSubject.service'
import { UserHasSubjectController } from './userHasSubject.controler';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UserHasSubjectController],
  providers: [UserHasSubjectService],
})
export class UserHasSubjectModule {}
