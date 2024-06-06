/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import { UserService } from '../user/user.service';

@Module({
    imports: [UserModule,
        JwtModule.register({
        global: true,
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, PrismaService, UserService]
})

export class AuthModule {}