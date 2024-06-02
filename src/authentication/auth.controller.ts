/* eslint-disable prettier/prettier */
import {
    Body,
    Controller,
    Post,
    Req, 
    Res,
    Logger
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "./dto/login-user.dto";
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {

    private readonly logger = new Logger(AuthController.name);

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
        } catch (error) {
            this.logger.error(`Error during login: ${error.message}`);
            return response.status(500).json({
                status: 'Erreur!',
                message: 'Connexion refusée'
            });
        }
    }
}