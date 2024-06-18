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
import { randomBytes } from 'crypto';
import { AuthRefreshGuard } from '../../src/guards/refresh.jwt.guards';
import { User } from "@prisma/client";
import { CustomException } from "../../src/exceptions/custom.exception";
import { RegisterUserDto } from "./dto/register-user.dto copy";

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

    //TODO: + CHILD
    @Post('register')
    async signup(
        @Body() data: RegisterUserDto
    ): Promise<{ user: User, message: string}> {
       const mail = data["user"]["email"]

             
        // verifier si email existe deja 
       const user = await this.userService.findByUnique({ email: mail})

        if(user) throw new CustomException('L\'utilisateur existe déjà', HttpStatus.CONFLICT, "UC-create-1")
           
      const passwordIni = await this.authService.hash(this.authService.generateRandomPassword(10));

        // creer nouveau utilisateur
        const new_user = await this.userService.create({...data["user"], password : passwordIni});

         // si subject exite dans data body
            
         if(data["subject"])
            {
            const subjects=data["subject"];
             
subjects.forEach(sub => {
    // chercher subject by name
    //TODO const subject = await this.subjectService.findByUnique({ name: sub });
    // faire jointure user id-subject id
    // TODO   const new_user-has-profile = await this.uhpService.create({subject.id,new_user.id});
  console.log(`Processed subject: ${sub} - ${new_user.id}`);
});
}
        // si children existe dans data body
        if(data["children"])
            {
            const children=data["children"];
             
children.forEach(child => {
    // chercher si child existe by first name and lastname
    //TODO const childTable= await this.childService.findByUnique({ firstName: child.firstName, lastName:child.lasName });
    //  if (!childTable) 
    // creer child

    // faire jointure user id-subject id
    // TODO   const new_user-has-profile = await this.uhpService.create({subject.id,new_user.id});
  console.log(`Processed subject: ${child.firstName} - ${new_user.id}`);
});
}
        // for chaque enfant () for n children : 

        // si enfnat not in bdd
        // const child= await this.childService.findByUnique({ firstName: firstName,lastName:lastName})
 // creer enfant --apeller post child du controleur child

 //  associer enfant au parents : creer jointure


       

       
        const message = `Utilisateur créé`;

        return {
            user: new_user,
            message
        }
    }

    //TODO: USER
    @Post('login')
    async signin(
        @Body() data: { email: string, password: string}
    ): Promise<{ access_token: string, refresh_token: string, user: User, message: string}> {
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

        const message = `Vous êtes bien connecté`;
        return {
            access_token,
            refresh_token,
            user,
            message
        }
    }

    //TODO: USER
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

    //FIXME: //?USER ?
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