/* eslint-disable prettier/prettier */
import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Post,
    Req,
    UnauthorizedException,
    UseGuards
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserService } from '../user/user.service';
import { Request as ExpressRequest } from 'express';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthRefreshGuard } from '../../src/guards/refresh.jwt.guards';
import { User } from "@prisma/client";
import { CustomException } from "src/exceptions/custom.exception";

//TODO: EMAIL | ACCOUNT VERIFICATION | USER SIGNIN
//TODO: USER SIGNOUT

interface Request extends ExpressRequest {
    user?: { sub: number, email: string};
    refreshToken: string;
}

@Controller('auth')
export class AuthController {

    constructor (
        private authService: AuthService,
        private userService: UserService,
        private jwtService: JwtService
    ) {}

    hashData(data:string) {
        return bcrypt.hash(data, 10);
    }

    @Post('register')
    async signup(
        @Body() data: { firstName: string, lastName: string, email: string, password: string}
    ): Promise<{ user: User, message: string}> {
        const user = await this.userService.findByUnique({
            email: data.email
        })

        // if(user) throw new HttpException('Server error', 401)
        if(user) throw new CustomException('L\'utilisateur existe déjà', HttpStatus.CONFLICT, "UC-create-1")

        data.password = await this.authService.hash(data.password);

        const new_user = await this.userService.create(data);

        delete new_user.password;

        const message = `Utilisateur créé`;

        return {
            user: new_user,
            message
        }
    }

    @Post('login')
    async signin(
        @Body() data: { email: string, password: string}
    ): Promise<{ access_token: string, refresh_token: string, user: User}> {
        const user = await this.userService.findByUnique({
            email: data.email
        })
        
        if(!user) throw new HttpException('Erreur', HttpStatus.CONFLICT)

        const isValid = await bcrypt.compare(data.password, user.password)

        if (!isValid) throw new HttpException('Erreur', HttpStatus.CONFLICT)

        const payload = { sub: user.id, email: user.email}

        delete user.password;

        const access_token = await this.jwtService.signAsync(payload, { secret: process.env.JWT_SECRET, expiresIn: '20m'})

        const refresh_token = await this.jwtService.signAsync(payload, { secret: process.env.JWT_REFRESH_TOKEN, expiresIn: '7d'});

        this.userService.update({ id: payload.sub }, { refreshToken: refresh_token });
        return {
            access_token,
            refresh_token,
            user
        }
    }

    @UseGuards(AuthRefreshGuard)
    @Post('signout')
    async logout(
        @Req() req: Request
    ):Promise <{message: string}> {
        const userId = String(req.user.sub);
        const user = await this.userService.findByUnique({id: userId})
        if(!user) throw new HttpException('Erreur', HttpStatus.CONFLICT)

        this.userService.update({id: user.id}, {refreshToken: ''})
        return {
            message: 'Vous avez bien été déconnecté'
        }
    }

    @UseGuards(AuthRefreshGuard)
    @Get('refresh_token')
    async refreshTokens(
        @Req() req: Request
    ): Promise<{ access_token: string, refresh_token: string, user: User }> {
        const user = await this.userService.findByRefreshToken(req.refreshToken)
        if(!user) throw new UnauthorizedException('server error')

        const refresh_token = await this.jwtService.signAsync({sub: user.id, email: user.email}, { secret: process.env.JWT_REFRESH_TOKEN, expiresIn: '8h'})
        this.userService.update({id: user.id}, {refreshToken: refresh_token})
        delete user.password
        delete user.refreshToken
        return {
            access_token: await this.jwtService.signAsync({ sub: user.id, email: user.email}, { secret: process.env.JWT_SECRET, expiresIn: '20m'}),
            refresh_token,
            user
        }
    }
}