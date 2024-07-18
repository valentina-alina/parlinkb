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
  Req,
  /* Put,
  Req,
  Delete,
  ExecutionContext */
} from "@nestjs/common";
import { AuthService } from "../auth/auth.service";
import { UserService } from '../user/user.service';

// import { Request as ExpressRequest } from 'express';
import { JwtService } from '@nestjs/jwt';
import { GetToken } from '../guards/getToken.decorator' 
import { jwtDecode } from 'jwt-decode';
// import * as bcrypt from 'bcrypt';
// import { randomBytes } from 'crypto';
// import { AuthRefreshGuard } from '../../src/guards/refresh.jwt.guards';
// import { Child} from "@prisma/client";
import { CustomException } from "../../src/exceptions/custom.exception";
import { RegisterUserDto } from "../user/dto/register-user.dto";
import { Request as ExpressRequest } from 'express';

import { SubjectService } from "../subject/subject.service";
import { ChildService } from "../child/child.service";

import { UserHasChildService } from "../child/userHasChild.service";
import { UserHasSubjectService } from "../userHasSubject/userHasSubject.service";

import { AuthGuard } from '../guards/jwt.guards';
import { AdminGuard } from "../guards/admin.jwt.guards";

// import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma, User } from '@prisma/client';
import { jwtPayloadDto } from "../guards/jwtPayload.dto"
import { AuthRefreshGuard } from "src/guards/refresh.jwt.guards";

interface Request extends ExpressRequest {
  user?: { sub: number, email: string };
  refreshToken: string;
}

@UseGuards(AuthGuard)
// @UseGuards(AuthRefreshGuard)
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

      if (user) throw new CustomException('L\'utilisateur existe déjà', HttpStatus.CONFLICT, "UC-create-1")

      const passwordIni = await this.authService.hash(this.authService.generateRandomPassword(10));

      const new_user = await this.userService.create({ ...data.user, password: passwordIni });

      messages = [...messages, `🚀 New user ${new_user.firstName} ${new_user.lastName} was created`];

          
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
        return {
          user: new_user,
          messages
      }
  }

  @UseGuards(AuthRefreshGuard)
    @Get('refresh_token')
    async refreshTokens(
        @Req() req: Request
    ): Promise<{ access_token: string, refresh_token: string, user: User }> {
      const user = await this.userService.findByRefreshToken(req.refreshToken)
      if (!user) throw new UnauthorizedException('server error')

      const refresh_token = await this.jwtService.signAsync({ sub: user.id, email: user.email }, { secret: process.env.JWT_REFRESH_TOKEN, expiresIn: '8h' })
      await this.userService.update({ id: user.id }, { refreshToken: refresh_token });

      delete user.password
      delete user.refreshToken
      return {
          access_token: await this.jwtService.signAsync({ sub: user.id, email: user.email }, { secret: process.env.JWT_SECRET, expiresIn: '20m' }),
          refresh_token,
          user
      }
  }

  @Post('signout')
  async logout(@GetToken() token: string): Promise<{ accestoken: string, refreshToken: string, message: string }> {
    console.log(token)

      if (!token) {
            throw new UnauthorizedException('Access denied: Token not found');
        }

        let tokenDecode: jwtPayloadDto;

        try {
            tokenDecode = jwtDecode<jwtPayloadDto>(token);
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
      const userId = tokenDecode.userId;
      const user = await this.userService.findByUnique({ id: userId })
      if (!user) throw new HttpException('Erreur: user non trouvé', HttpStatus.CONFLICT)
        
        const payload = { userId: "", role: "" }
        const access_token = await this.jwtService.signAsync(payload, { secret: process.env.JWT_SECRET, expiresIn: '20m' })

        // const refresh_token = await this.jwtService.signAsync(payload, { secret: process.env.JWT_REFRESH_TOKEN, expiresIn: '7d' });
        
      this.userService.update({ id: user.id }, { refreshToken: '' })
      return {accestoken : access_token,
        refreshToken: '',
          message: 'Vous avez bien été déconnecté'
      }
  }

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

  @Get()
  async getUsersWithDetails(@Query() query: { skip?: string; take?: string }): Promise<{ users :any[], message :string }> {
    const prismaOptions: Prisma.UserFindManyArgs = {};
    if (query.skip) prismaOptions.skip = +query.skip;
    if (query.take) prismaOptions.take = +query.take;

    const users = await this.userService.getUsersWithDetails(prismaOptions);
    const message = 'All users with details';

    return {
          users,
          message
        };
  }
}