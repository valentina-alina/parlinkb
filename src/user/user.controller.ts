/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,Delete,
  UnauthorizedException,
  UseGuards,
  Param,
  Put
} from "@nestjs/common";
import { AuthService } from "../auth/auth.service";
import { UserService } from '../user/user.service';

import { Request as ExpressRequest } from 'express';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { AuthRefreshGuard } from '../../src/guards/refresh.jwt.guards';
import { Child} from "@prisma/client";
import { CustomException } from "../../src/exceptions/custom.exception";
import { RegisterUserDto } from "../user/dto/register-user.dto"

import { SubjectService } from "../subject/subject.service";
import { ChildService } from "../child/child.service";

import { UserHasChildService } from "../child/userHasChild.service";
import { UserHasSubjectService } from "../userHasSubject/userHasSubject.service";

import { AuthGuard } from '../guards/jwt.guards';
import { AdminGuard } from "../guards/admin.jwt.guards";

import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma, User } from '@prisma/client';



@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private authService: AuthService,
    private jwtService: JwtService,
    private subjectService: SubjectService,
    private childService: ChildService,
    private uhcService: UserHasChildService,
    private userHasSubjectService: UserHasSubjectService,
  ) {}

  //FIXME: // ?? register un user by a admin : voir s'il faut verifier que l'user connecté est un admin: meme si c'est fait dans le front
  @UseGuards(AuthGuard)
  @UseGuards(AdminGuard)
  @Post('register')
  async signup(
      @Body() data: RegisterUserDto): Promise<{ user: User, messages: string [] }> {
          let messages: string[] = [];
      const mail = data.user.email

      const user = await this.userService.findByUnique({ email: mail })

      if (user) throw new CustomException('L\'utilisateur existe déjà', HttpStatus.CONFLICT, "UC-create-1")

      const passwordIni = await this.authService.hash(this.authService.generateRandomPassword(10));
     
      const new_user = await this.userService.create({ ...data.user, password: passwordIni });

      messages = [...messages, `🚀 New user ${new_user.firstName} ${new_user.lastName} was created`];
   
      // console.log(" New user created ", new_user)
      
      if (data.subjects) {
          const subjects = data.subjects;
          await Promise.all(subjects.map(async (sub) => {
              const subject = await this.subjectService.findByUnique({ name: sub });
              if (subject) {
                  const new_user_has_subject = await this.userHasSubjectService.create({ userId: new_user.id, subjectId: subject["id"] });
                  messages = [...messages, `🚀 Le sujet ${sub} a été associé à ${new_user.firstName} ${new_user.lastName}`];
                  console.log('🚀 User has subject : ', new_user_has_subject);
              } else {
                  messages = [...messages, `🚀 Le sujet ${sub} n'existe pas`];
                  console.log(`🚀 Le sujet "${sub}" n'existe pas`);
              }
          }));
      }
      if (data.children) {
          const children = data.children;
          await Promise.all(children.map(async (element) => {
              const out = await this.childService.findAllByFilters(element);
              let child = out[0];
              if (!child) {
                const childOut = await this.childService.create(element);
                  messages = [...messages, `🚀 Child created: ${childOut.child.firstName} ${childOut.child.lastName}`];
                  console.log("🚀 child:created", childOut);
                  child=childOut.child;
              }
              const new_user_has_child = await this.uhcService.create({ userId: new_user.id, childId: child.id });
              messages = [...messages, `🚀 ${new_user.firstName} ${new_user.lastName} has child: ${child.firstName} ${child.lastName}`];
              console.log("🚀 user has child:created", new_user_has_child);
          }));
      }
      console.log(messages);

      return {
          user: new_user,
          messages
      }
  }



  // // FIXME: effacer aussi toutes les autres jointures par rapport a user : file, messge, ad, usergroup.....
  // @Delete('delete/:userId')
  // async deleteByUserId(@Param('userId') userId: string): Promise<{ message: string }> {
  //   try {
  //     // TODO verif si user has subject existe
  //     const userHasSubject = await this.userHasSubjectService.deleteByUserId(userId);
  // } catch (error) {
  //     throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  //   }
  //   console.log("🚀 ~ AuthController ~ deleteByUserId ~   user has subject")
  //   try {
  //     const uhcService = await this.uhcService.deleteByUserId(userId);
  // } catch (error) {
  //     throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  //   }
  //   console.log("🚀 ~ AuthController ~ deleteByUserId ~   user has child")
  //   try {
  //     const result = await this.userService.deleteByUserId(userId);
  //     return result;

  //   } catch (error) {
  //     throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  //   }
  // }
 


 

  // //TODO: USER
  // @UseGuards(AuthRefreshGuard)
  // @Post('signout')
  // async logout(
  //     @Req() req: Request
  // ): Promise<{ message: string }> {
  //     const userId = String(req.user.sub);
  //     const user = await this.userService.findByUnique({ id: userId })
  //     if (!user) throw new HttpException('Erreur', HttpStatus.CONFLICT)

  //     this.userService.update({ id: user.id }, { refreshToken: '' })
  //     return {
  //         message: 'Vous avez bien été déconnecté'
  //     }
  // }

  // //FIXME: //?USER ?
  // @UseGuards(AuthRefreshGuard)
  // @Get('refresh_token')
  // async refreshTokens(
  //     @Req() req: Request
  // ): Promise<{ access_token: string, refresh_token: string, user: User }> {
  //     const user = await this.userService.findByRefreshToken(req.refreshToken)
  //     if (!user) throw new UnauthorizedException('server error')

  //     const refresh_token = await this.jwtService.signAsync({ sub: user.id, email: user.email }, { secret: process.env.JWT_REFRESH_TOKEN, expiresIn: '8h' })
  //     this.userService.update({ id: user.id }, { refreshToken: refresh_token })
  //     delete user.password
  //     delete user.refreshToken
  //     return {
  //         access_token: await this.jwtService.signAsync({ sub: user.id, email: user.email }, { secret: process.env.JWT_SECRET, expiresIn: '20m' }),
  //         refresh_token,
  //         user
  //     }
  // }

// trouver user by id
  @Get(':id')
  async readRoute(
      @Param('id') id: string,
  ): Promise<{user: User, message: string}> {
  
    const user = await this.userService.findByUnique({ id });

    if (!user) throw new HttpException('L\'utilisateur n\'a pas été trouvé', HttpStatus.CONFLICT)
    
    const message = `Utilisateur avec l\'id ${id}`;
    return {
      user,
      message
    };
  }

  
    //FIXME: //?USER ? ou auth verifier et preciser le choix
//     @UseGuards(AuthRefreshGuard)
//     @Get('refresh_token')
//     async refreshTokens(
//         @Req() req: Request
//     ): Promise<{ access_token: string, refresh_token: string, user: User }> {
//         const user = await this.userService.findByRefreshToken(req.refreshToken)
//         if (!user) throw new UnauthorizedException('server error')

//         const refresh_token = await this.jwtService.signAsync({ sub: user.id, email: user.email }, { secret: process.env.JWT_REFRESH_TOKEN, expiresIn: '8h' })
//         this.userService.update({ id: user.id }, { refreshToken: refresh_token })
//         delete user.password
//         delete user.refreshToken
//         return {
//             access_token: await this.jwtService.signAsync({ sub: user.id, email: user.email }, { secret: process.env.JWT_SECRET, expiresIn: '20m' }),
//             refresh_token,
//             user
//         }
//     }
}