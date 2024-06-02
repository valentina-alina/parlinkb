/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly prismaService: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET
        })
    }

    async validate(payload: {id: string, firstName:string}) {
        const users = await this.prismaService.user.findUnique({
            where: {
                id: payload.id,
                firstName: payload.firstName
            }
        })
        return users;
    }
}