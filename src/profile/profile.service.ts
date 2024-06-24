/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Prisma, Profile } from '@prisma/client';
import { PrismaService } from'../../prisma/prisma.service';
import { IsPostalCode } from 'class-validator';

//TODO: UTILISATION DE AUTH.SERVICE ??

@Injectable()
export class ProfileService {

  constructor(
    private readonly prisma: PrismaService,
    
  ) {} 

  async findAllByParams(options: Prisma.ProfileFindManyArgs): Promise<Profile[]>{
    return this.prisma.profile.findMany(options);
  }


  async create(data: Prisma.ProfileCreateInput): Promise<Profile> {
    return  this.prisma.profile.create({  data });
     
  }

 
  async findByUnique(
    profileWhereUniqueInput: Prisma.ProfileWhereUniqueInput
  ): Promise<Profile | null> {
    return this.prisma.profile.findUnique({
      where: profileWhereUniqueInput
    });
  }

  

  async update(
      where: Prisma.ProfileWhereUniqueInput,
      data: Prisma.ProfileUpdateInput
    ): Promise<Profile> {
      return this.prisma.profile.update({
        where,
        data,
      });
  }

  async delete(where: Prisma.ProfileWhereUniqueInput): Promise<Profile> {
    return this.prisma.profile.delete({
      where,
    })
  };
}
