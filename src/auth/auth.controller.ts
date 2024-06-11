/* eslint-disable prettier/prettier */
import {
    Body,
    Controller,
    Get,
    HttpException,
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
    ): Promise<any> {
        const user = await this.userService.findByUnique({
            email: data.email,
            id: ""
        })

        if(user) {
            return new HttpException('Server error', 401)
        }

        data.password = await this.authService.hash(data.password);

        const new_user = await this.userService.create(data);

        return {
            user: new_user,
            date: new Date(),
            message: "utilisateur créé",
        }
    }

    @Post('login')
    async signin(
        @Body() data: { email: string, password: string}
    ): Promise<any> {
        const user = await this.userService.findByUnique({
            email: data.email
        })
        
        if(!user) {
            throw new HttpException('Les identifiants ne correspondent pas - test1', 401)
        }

        const isValid = await bcrypt.compare(data.password, user.password)
        if (!isValid) {
            throw new HttpException('Les identifiants ne correspondent pas - test2', 401)
        }

        const payload = { sub: user.id, email: user.email}

        delete user.password;

        const refresh_token = await this.jwtService.signAsync(payload, { secret: process.env.JWT_REFRESH_TOKEN, expiresIn: '7d'});

        this.userService.update({ id: payload.sub }, { refreshToken: refresh_token });
        return {
            access_token: await this.jwtService.signAsync(payload, { secret: process.env.JWT_SECRET, expiresIn: '20m'}),
            refresh_token,
            user
        }
    }

    @UseGuards(AuthRefreshGuard)
    @Post('signout')
    async logout(
        @Req() req: Request
    ) {
        const userId = String(req.user.sub);
        const user = await this.userService.findByUnique({id: userId})
        if(!user) {
            throw new HttpException('server error', 401)
        }

        this.userService.update({id: user.id}, {refreshToken: ''})
        return {
            message: 'Vous avez bien été déconnecté'
        }
    }

    @UseGuards(AuthRefreshGuard)
    @Get('refresh_token')
    async refreshTokens(
        @Req() req: Request
    ) {
        const user = await this.userService.findByRefreshToken(req.refreshToken)
        if(!user) {
            throw new UnauthorizedException('server error')
        }

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