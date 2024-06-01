/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(@Query() query: {skip?: string, take?: string}): Promise<User[]> {
    return this.userService.findAll(+query.skip, +query.take);
  }

  @Post()
    async create(
      @Param('id') id: string,
      @Body() data: CreateUserDto): Promise<User | { error: boolean, message: string }> {
        const user = await this.userService.findByUnique({
          email: data.email,
          id: ''
        });

        if(user) {
            return { error: true, message: "l'utilisateur existe déjà" + user.email};
        }
        return this.userService.create(data);
  }

  @Get(':id')
  async readRoute(
      @Param('id') id: string,
  ): Promise<User | { error: boolean, message: string }> {
  
      const user = await this.userService.findByUnique({ id });

      if (!user) {
          return { error: true, message: "pas d'utilisateur à cet id" + id};
      }

      return user;
  }

  @Put(':id')
  async updateRoute(
      @Param('id') id: string,
      @Body() userUpdateDto: UpdateUserDto,
  ): Promise<User | { error?: boolean, message: string }> {
      const user = this.userService.findByUnique({ id });
      
      if(!user) {
          return { error: true, message: `Pas d\'utilisateur trouvé avec cet id ${id}` }
      }

      const user_email = await this.userService.findByUnique({
        email: userUpdateDto.email,
        id: ''
      });

      if(!user_email) {
          return { error: true, message: `Pas d\'utilisateur trouvé avec cet email ${user_email} ` }
      }
      const userUpdate = await this.userService.update({ id }, userUpdateDto);

      return { message: `Utilisateur avec id ${id} à jour`, ...userUpdate}
  }

  @Delete(':id')
    async deleteRoute(@Param('id') id: string,): Promise<User | { error?: boolean, message: string }> {
        const user = await this.userService.findByUnique({ id })
        if(!user) {
            return { error: true, message: 'L\'utilisateur n\'a pas été trouvé'}
        }
        this.userService.delete({id });
        return { message: `L'utilisateur avec l'id ${ id } a bien été supprimé` }
    }
}
