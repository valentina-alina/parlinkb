/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../../prisma/prisma.module';
import { SubjectModule } from '../subject/subject.module';
import { SubjectService } from '../subject/subject.service';
import { ChildModule } from '../child/child.module';
import { ChildService } from '../child/child.service';
import { UserHasChildService } from '../child/userHasChild.service';
import { UserHasSubjectService } from '../userHasSubject/userHasSubject.service';


@Module({
    imports: [
        PrismaModule, 
        UserModule,
        SubjectModule,ChildModule,
        JwtModule.register({
        global: true,
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService,SubjectService,ChildService,UserHasChildService, UserHasSubjectService]
})

export class AuthModule {}