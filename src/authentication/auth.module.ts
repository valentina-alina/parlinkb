/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthService } from '../authentication/auth.service';
import { AuthController } from '../authentication/auth.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { JWTStrategy } from './jwt.strategy';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        PrismaModule,
        UserModule,
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: {
                expiresIn: process.env.EXPIRES_IN
            }
        })
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        JWTStrategy,
        UserService
    ],
})
export class AuthModule {}