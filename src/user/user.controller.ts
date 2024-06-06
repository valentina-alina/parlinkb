/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';
import { CustomException } from '../exceptions/custom.exception';

////////////////////////////////!

//TODO: CREATE USER + CREATE PROFILE --> AUTH SIGNUP | REGISTER ??
//TODO: DELETE USER + DELETE PROFILE --> AUTH DELETE | REMOVE ??
//TODO: READ USER BY ID --> AUTH ??
//TODO: READ ALL USERS --> AUTH ??

//TODO: EMAIL | ACCOUNT VERIFICATION --> USER SIGNIN
//TODO: USER PASSWORD UPDATE
//TODO: USER PROFILE UPDATE
//TODO: USER SIGNOUT

////////////////////////////////!

//TODO: USER PROFILE UPDATE ??
//TODO: READ USER BY CURRENT USER ID

//TODO: USER CREATE AD
//TODO: USER READ ALL ADS
//TODO: USER READ ADS BY PARAMS
//TODO: USER READ AD BY ID
//TODO: USER UPDATE AD
//TODO: USER DELETE SELF PUBLISHED AD/S

//TODO: USER CREATE SUBSCRIPTION/S
//TODO: USER READ ALL SUBSCRIPTIONS
//TODO: USER READ SUBSCRIPTIONS BY PARAMS --> UPDATE | DELETE [FINDBYPARAMS]
//TODO: USER READ SUBSCRIPTIONS BY ID --> UPDATE | DELETE [FINDBYUNIQUE]
//TODO: USER UPDATE SUBSCRIPTIONS
//TODO: USER DELETE SUBSCRIPTIONS

//TODO: USER CREATE MESSAGE
//TODO: USER READ ALL MESSAGES
//TODO: USER READ MESSAGES BY PARAMS --> UPDATE | DELETE [FINDBYPARAMS]
//TODO: USER READ MESSAGES BY ID --> UPDATE | DELETE [FINDBYUNIQUE]
//TODO: USER UPDATE MESSAGES
//TODO: USER DELETE MESSAGES

//TODO: USER CREATE FILE
//TODO: USER READ ALL FILES
//TODO: USER READ FILES BY PARAMS --> UPDATE | DELETE [FINDBYPARAMS]
//TODO: USER READ FILES BY ID --> UPDATE | DELETE [FINDBYUNIQUE]
//TODO: USER DELETE FILES

//TODO: USER CREATE USER GROUP
//TODO: USER READ ALL USER GROUPS
//TODO: USER READ USER GROUPS BY PARAMS --> UPDATE | DELETE [FINDBYPARAMS]
//TODO: USER READ USER GROUPS BY ID --> UPDATE | DELETE [FINDBYUNIQUE]
//TODO: USER UPDATE USER GROUPS
//TODO: USER DELETE USER GROUPS

//TODO: //FIXME: CREATE SUBJECTS ??
//TODO: //FIXME: READ ALL SUBJECTS ??
//TODO: //FIXME: READ SUBJECT BY PARAMS [FINDBYPARAMS] ??
//TODO: //FIXME: READ SUBJECT BY ID [FINDBYID] ??
//TODO: //FIXME: UPDATE SUBJECTS ??
//TODO: //FIXME: DELETE SUBJECTS ??

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
      @Body() data: CreateUserDto): Promise<any> {
        const user = await this.userService.findByUnique({email: data.email,
          id: ''
        });

        if(user) {
          throw new CustomException('L\'utilisateur existe déjà', HttpStatus.CONFLICT, "UC-create-1")
        }
        const new_user =  await this.userService.create(data);
        delete new_user.password

        return {
            user: new_user,
            date: new Date(),
            message: 'Utilisateur créé'
        }
  }

  @Get(':id')
  async readRoute(
      @Param('id') id: string,
  ): Promise<User | { error: boolean, message: string }> {
  
    const user = await this.userService.findByUnique({ id });

    if (!user) {
      return { error: true, message: "Pas d'utilisateur à  l'id" + id};
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

      return { message: `Utilisateur avec l'id ${id} a bien été mis à jour`, ...userUpdate}
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
