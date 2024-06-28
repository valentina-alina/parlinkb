/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma, User } from '@prisma/client';
import { CustomException } from '../exceptions/custom.exception';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from "../auth/auth.service"

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private authService: AuthService
  ) {}

//   hashData(data: string) {
//     return bcrypt.hash(data, 10);
// }

   // //TODO: USER
    @Post('login')
    async signin(
        @Body() data: { email: string, password: string }
    ): Promise<{ access_token: string, refresh_token: string, user: User, message: string }> {
        const user = await this.userService.findByUnique({
            email: data.email
        })

        if (!user) throw new HttpException('Erreur: identifiants incorrects, HttpStatus.CONFLICT)

        const isValid = await bcrypt.compare(data.password, user.password)

        if (!isValid) throw new HttpException(`Erreur : Identifiants incorrects`, HttpStatus.CONFLICT)

        const payload = { sub: user.id, email: user.email }

        delete user.password;

        const access_token = await this.jwtService.signAsync(payload, { secret: process.env.JWT_SECRET, expiresIn: '20m' })

        const refresh_token = await this.jwtService.signAsync(payload, { secret: process.env.JWT_REFRESH_TOKEN, expiresIn: '7d' });

        this.userService.update({ id: payload.sub }, { refreshToken: refresh_token });

        const message = `Vous êtes bien connecté`;
        return {
            access_token,
            refresh_token,
            user,
            message
        }
    }

  // @Get()
  // async findAllByParams(@Query() options: {skip?: string, take?: string }): Promise<{users: User[], message: string}> {
  //   const new_options: Prisma.UserFindManyArgs = {}
  //   options.skip? new_options.skip = +options.skip : null
  //   options.take? new_options.take = +options.take : null

  //   const users = await this.userService.findAllByParams(new_options);
  //   const message = `Liste des utilisateurs`

  //   return {
  //     users,
  //     message
  //   };
  // }

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

  @Put(':id')
  async updateRoute(
    @Param('id') id: string,
    @Body() userUpdateDto: UpdateUserDto,
  ): Promise<{ user: User; message: string }> {
    const user = await this.userService.findByUnique({ id });

    if (!user) {
      throw new HttpException('L\'utilisateur n\'a pas été trouvé', HttpStatus.NOT_FOUND);
    }
    if (userUpdateDto.password) {
      userUpdateDto.password = await this.authService.hash(userUpdateDto.password);}
    const userUpdate = await this.userService.update({ id }, userUpdateDto);

    delete userUpdate.password;

    const message = `L'utilisateur avec l'id ${id} a bien été mis à jour`;

    return {
      user: userUpdate,
      message,
    };
  }

}