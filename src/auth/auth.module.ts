/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../../prisma/prisma.module';
import { SubjectModule } from '../subject/subject.module';
import { SubjectService } from '../subject/subject.service';

@Module({
    imports: [
        PrismaModule, 
        UserModule,
        SubjectModule,
        JwtModule.register({
        global: true,
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService,SubjectService]
})

export class AuthModule {}