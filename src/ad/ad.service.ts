/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Ad, Prisma } from '@prisma/client';
// import { CreateAdDto } from './dto/create-ad.dto';
// import { UpdateAdDto } from './dto/update-ad.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdService {

  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.AdCreateInput): Promise<Ad> {
    return this.prisma.ad.create({
        data,
    })
  }

  async findAllByParams(options: Prisma.AdFindManyArgs): Promise<Ad[]>{
    return this.prisma.ad.findMany(options);
  }

  async findByUnique(
    adWhereUniqueInput: Prisma.AdWhereUniqueInput
  ): Promise<Ad | null> {
    return this.prisma.ad.findUnique({
      where: adWhereUniqueInput
    });
  }

  async update(
    where: Prisma.AdWhereUniqueInput,
    data: Prisma.AdUpdateInput
  ): Promise<Ad> {
    return this.prisma.ad.update({
      where,
      data,
    });
  }

  async delete(where: Prisma.AdWhereUniqueInput): Promise<Ad> {
    return this.prisma.ad.delete({
        where
    })
  };
}