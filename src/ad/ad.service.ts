/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Ad, Prisma } from '@prisma/client';
// import { CreateAdDto } from './dto/create-ad.dto';
// import { UpdateAdDto } from './dto/update-ad.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { GetAdsCategoryDto } from './dto/get-ads-category.dto';
// import { GetAdsUserDto } from './dto/get-ads-user.dto';

@Injectable()
export class AdService {

  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.AdCreateInput): Promise<Ad> {
    return this.prisma.ad.create({
        data,
    })
  }

  async findAll(): Promise<Ad[]> {
    return this.prisma.ad.findMany();
  }

  async findAllByParams(options: Prisma.AdFindManyArgs): Promise<Ad[]>{
    return this.prisma.ad.findMany(options);
  }

  async findAllByFilters(query: string): Promise<Ad[]>{
    return this.prisma.ad.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query
            }
          },
          {
            city: {
              contains: query
            }
          }
        ]
      }
    })
  }

  async findAllByCategories({categoryName, subCategoryName} : GetAdsCategoryDto): Promise<Ad[]>{
    return this.prisma.ad.findMany({
      where: {
        OR: [
          {
            category: {
              name: categoryName,
            },
          },
          {
            subCategory: {
              name: subCategoryName,
            },
          },
        ],
      }
    })
  }

  async findAllByUser(query: string): Promise<Ad[]>{
    return this.prisma.ad.findMany({
      where: {
        users: {
          id: query
        }
      }
    })
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