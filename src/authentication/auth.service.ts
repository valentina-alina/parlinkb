/* eslint-disable prettier/prettier */
import { Injectable, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "prisma/prisma.service";
import { UserService } from "src/user/user.service";
import { LoginUserDto } from "./dto/login-user.dto";
// import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    private readonly logger = new Logger(AuthService.name);

    constructor(
        private readonly prismaService: PrismaService,
        private jwtService: JwtService,
        private readonly userService: UserService
    ) {}

    async login(loginDto: LoginUserDto): Promise<any | { error: boolean, message: string }>{
        const { firstName, password } = loginDto;

        const user = await this.userService.findByFirstName(firstName);

        if(!user) {
            return { error: true, message: 'Pas d\'utilisateur à ce nom'}
        }

        const userWithPassword = await this.userService.findByPassword(password);

        // If user with provided password doesn't exist or is not the same as the user retrieved by first name, return error
        if (!userWithPassword || userWithPassword.id !== user.id) {
            return { error: true, message: 'Mot de passe incorrect' };
        }

        return {
            token: this.jwtService.sign({firstName})
        }
    } catch (error) {
        this.logger.error(`Erreur à la connexion: ${error.message}`);
        throw error;
    }
}