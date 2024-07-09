/* eslint-disable prettier/prettier */
import {
    Body,
    Controller,
    HttpException,
    HttpStatus,
    Param,
    Post,
    Put,
} from "@nestjs/common";

import { AuthService } from "./auth.service";
import { UserService } from '../user/user.service';

import { CreateAdminDto } from "./dto/createAdmin.dto"
import { ChangePasswordDto } from "./dto/changePassword.dto";
import { LoginUserDto } from "./dto/login-user.dto";

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from "@prisma/client";

import { CustomException } from "../../src/exceptions/custom.exception";

// TODO envoyer mail avec l'id de l'admin crée dans un jwttoken

@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService,
        private userService: UserService,
        private jwtService: JwtService,
    ) { }
  
    @Post('register')
    async signup(
        @Body() data: CreateAdminDto): Promise<{ user: User, messages: string[] }> {
          
        let messages: string[] = [];
        let role: UserRole="admin";
      console.log(data)

        const user = await this.userService.findByUnique({ email: data.email })

        if (user) throw new CustomException('L\'utilisateur existe déjà', HttpStatus.CONFLICT, "UC-create-1")

        const passwordIni = await this.authService.hash(this.authService.generateRandomPassword(10));
        const a={ ...data, password: passwordIni, role: role};
        console.log("a",a)
        const userAdmin = await this.userService.create({ ...data, password: passwordIni, role: role});

        messages = [...messages, `🚀 New user ${userAdmin.firstName} ${userAdmin.lastName} was created`];

        return {
            user: userAdmin,
            messages
        }
    }

    // changer password pour user by id
    @Put(':id')
    async updateRoute(
        @Param('id') id: string,
        @Body() data: ChangePasswordDto
    ): Promise<{ user: User; message: string }> {
        const user = await this.userService.findByUnique({ id });

        if (!user) {
            throw new HttpException('L\'utilisateur n\'a pas été trouvé', HttpStatus.NOT_FOUND);
        }
        if (data.password) {
            data.password = await this.authService.hash(data.password);
        }
        const userUpdate = await this.userService.update({ id }, { password: data.password });

        delete userUpdate.password;

        const message = `L'utilisateur avec l'id ${id} a bien été mis à jour`;

        return {
            user: userUpdate,
            message,
        }
    }



    @Post('login')
    async login(
        @Body() data: LoginUserDto
    ): Promise<{ access_token: string, refresh_token: string, message: string }> {

        const user = await this.userService.findByUnique({ email: data.email })

        if (!user) throw new HttpException('Erreur: identifiants incorrects', HttpStatus.CONFLICT);

        const isValid = await bcrypt.compare(data.password, user.password)

        if (!isValid) throw new HttpException(`Erreur : Identifiants incorrects`, HttpStatus.CONFLICT)

        const payload = { userId: user.id, role: user.role }

        delete user.password;

        const access_token = await this.jwtService.signAsync(payload, { secret: process.env.JWT_SECRET, expiresIn: '20m' })

        const refresh_token = await this.jwtService.signAsync(payload, { secret: process.env.JWT_REFRESH_TOKEN, expiresIn: '7d' });

        this.userService.update({ id: payload.userId }, { refreshToken: refresh_token });

        const message = `Vous êtes bien connecté`;
        return {
            access_token,
            refresh_token,
            message
        }
    }

}