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

  // changer password pour user by id
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