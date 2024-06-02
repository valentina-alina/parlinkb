/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "prisma/prisma.service";
import { UserService } from "src/user/user.service";
import { LoginUserDto } from "./dto/login-user.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(
        private readonly prismaService: PrismaService,
        private jwtService: JwtService,
        private readonly userService: UserService
    ) {}

    async login(loginDto: LoginUserDto): Promise<any | { error: boolean, message: string }>{
        const { firstName, password } = loginDto;

        const users = await this.userService.findByFirstName(firstName);

        if(!users) {
            return { error: true, message: 'Pas d\'utilisateur à ce nom'}
        }

        const validatePassword = await bcrypt.compare(password, users.password)

        if(!validatePassword) {
            return { error: true, message: 'Mot de passe non reconnu'}
        }

        return {
            token: this.jwtService.sign({firstName})
        }
    }
}