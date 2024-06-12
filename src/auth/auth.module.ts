/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [PrismaModule, UserModule,
        JwtModule.register({
        global: true,
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService]
})

export class AuthModule {}