/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Ad } from '@prisma/client';
// import { CreateAdDto } from './dto/create-ad.dto';
// import { UpdateAdDto } from './dto/update-ad.dto';
import { PrismaService } from 'prisma/prisma.service';

//TODO:
@Injectable()
export class AdService {

  private ads: Ad[] = [];

  constructor(private prisma: PrismaService) {}

  /* async create(data: CreateAdDto): Promise<Ad> {
    return this.prisma.ad.create({
        data,
    })
  }
 */
  async findAll() {
    return `This action returns all ad`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} ad`;
  }

  /* async update(id: number, updateAdDto: UpdateAdDto) {
    return `This action updates a #${id} ad`;
  } */

  async remove(id: number) {
    return `This action removes a #${id} ad`;
  }
}
