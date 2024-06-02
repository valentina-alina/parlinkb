/* eslint-disable prettier/prettier */
import {
    Body,
    Controller,
    Post,
    Req, 
    Res
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "./dto/login-user.dto";
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(
        @Req() request:Request,
        @Res() response: Response,
        @Body() loginDto: LoginUserDto
    ): Promise<any> {
        try {
            const result= await this.authService.login(loginDto);
            return response.status(200).json({
                status: 'Ok!',
                message: 'Connexion établie',
                result: result
            })
        } catch (err) {
            return response.status(500).json({
                status: 'Erreur!',
                message: 'Connexion refusée'
            })
        }
    }
}