/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Prisma, Profile } from '@prisma/client';
import { UserService } from '../user/user.service';
import { AuthGuard } from '../guards/jwt.guards';

//TODO: CREATE , UPDATE , READ , DELETE MY PROFILE  ??

@UseGuards(AuthGuard)
@Controller('profile')
export class ProfileController {

  constructor(
    private readonly profileService: ProfileService, 
    private readonly userService: UserService
  ) {}
  
  @Get()
  async findAllByParams(@Query() options: {skip?: string, take?: string }): Promise<Profile[]> {
    const new_options: Prisma.ProfileFindManyArgs = {}
    options.skip? new_options.skip = +options.skip : null
    options.take? new_options.take = +options.take : null

    return this.profileService.findAllByParams(new_options);
  }

  @Post()
  async create(){
    console.log("create")
    return ("create vide");
  }
}