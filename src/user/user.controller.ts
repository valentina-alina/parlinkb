/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  UnauthorizedException,
  UseGuards,
  Param,
  Query,
} from "@nestjs/common";
import { AuthService } from "../auth/auth.service";
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { GetToken } from '../guards/getToken.decorator' 
import { jwtDecode } from 'jwt-decode';
// import * as bcrypt from 'bcrypt';
// import { randomBytes } from 'crypto';
// import { Child} from "@prisma/client";
import { CustomException } from "../../src/exceptions/custom.exception";
import { RegisterUserDto } from "../user/dto/register-user.dto";

import { SubjectService } from "../subject/subject.service";
import { ChildService } from "../child/child.service";

import { UserHasChildService } from "../child/userHasChild.service";
import { UserHasSubjectService } from "../userHasSubject/userHasSubject.service";

import { AuthGuard } from '../guards/jwt.guards';
import { AdminGuard } from "../guards/admin.jwt.guards";

// import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma, User } from '@prisma/client';
import { jwtPayloadDto } from "../guards/jwtPayload.dto"
import { AuthRefreshGuard } from "../guards/refresh.jwt.guards";

interface getByIdResponse{
  firstName: string;
  lastName:string;
} 

@UseGuards(AuthGuard)
@UseGuards(AuthRefreshGuard)
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


  @UseGuards(AdminGuard)
  @Post('register')
  async signup(
      @Body() data: RegisterUserDto): Promise<{ user: User, messages: string [] }> {
          let messages: string[] = [];
      const mail = data.user.email

      const user = await this.userService.findByUnique({ email: mail })

      if (user) throw new CustomException(`L'utilisateur existe déjà`, HttpStatus.CONFLICT, "UC-create-1")

      const passwordIni = await this.authService.hash(this.authService.generateRandomPassword(10));

      const new_user = await this.userService.create({ ...data.user, password: passwordIni });

      messages = [...messages, `🚀 Le nouvel utilisateur ${new_user.firstName} ${new_user.lastName} a été créé`];

          
      if (data.subjects) {
          const subjects = data.subjects;
          await Promise.all(subjects.map(async (sub) => {
              const subject = await this.subjectService.findByUnique({ name: sub });
              if (subject) {
                  const new_user_has_subject = await this.userHasSubjectService.create({ userId: new_user.id, subjectId: subject["id"] });
                  messages = [...messages, `🚀 La matière ${sub} a été associée à ${new_user.firstName} ${new_user.lastName}`];
                  console.log(`🚀 Utilisateur a la matière : `, new_user_has_subject);
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
                  messages = [...messages, `🚀 Enfant créé: ${childOut.child.firstName} ${childOut.child.lastName}`];
                  console.log(`🚀 Enfant:créé`, childOut);
                  child=childOut.child;
              }
              const new_user_has_child = await this.uhcService.create({ userId: new_user.id, childId: child.id });
              messages = [...messages, `🚀 ${new_user.firstName} ${new_user.lastName} a l'enfant: ${child.firstName} ${child.lastName}`];
              console.log(`🚀 Utilisateur a l'enfant:créé`, new_user_has_child);
          }));
      }
        return {
          user: new_user,
          messages
      }
  }

  @Post('signout')
  async logout(@GetToken() token: string): Promise<{ access_token: string, refresh_token: string, message: string }> {
    console.log(token)

      if (!token) {
            throw new UnauthorizedException(`Accès refusé: Token non trouvé`);
        }

        let tokenDecode: jwtPayloadDto;

        try {
            tokenDecode = jwtDecode<jwtPayloadDto>(token);
        } catch (error) {
            throw new UnauthorizedException(`Token invalide`);
        }
      const userId = tokenDecode.userId;
      const user = await this.userService.findByUnique({ id: userId })
      if (!user) throw new HttpException('Erreur: utilisateur non trouvé', HttpStatus.CONFLICT)
        
        /* const payload = { userId: "", role: "" } */
        /* const access_token = await this.jwtService.signAsync(payload, { secret: process.env.JWT_SECRET, expiresIn: '20m' }) */

        // const refresh_token = await this.jwtService.signAsync(payload, { secret: process.env.JWT_REFRESH_TOKEN, expiresIn: '7d' });
        
      this.userService.update({ id: user.id }, { refreshToken: '' })
      return {access_token : '',
        refresh_token: '',
          message: 'Vous avez bien été déconnecté'
      }
  }

  @Get()
  async getUsersWithDetails(@Query() query: { skip?: string; take?: string }): Promise<{ users :any[], message :string }> {
    const prismaOptions: Prisma.UserFindManyArgs = {};
    if (query.skip) prismaOptions.skip = +query.skip;
    if (query.take) prismaOptions.take = +query.take;

    const users = await this.userService.getUsersWithDetails(prismaOptions);

    return {
          users,
          message: `Tous les utilisateurs avec les détails`,
        };
  }

  @Get(':id')
  async readRoute(
      @Param('id') id: string,
  ): Promise<{data: getByIdResponse, message: string}> {

    const user = await this.userService.findByUnique({ id });

    const data = {
      firstName: user.firstName,
      lastName: user.lastName,
    };

    if (!user) throw new HttpException(`L'utilisateur n'a pas été trouvé`, HttpStatus.CONFLICT)

    return {data,
      message: `Utilisateur avec l'id ${id}`,
    };
  }
}