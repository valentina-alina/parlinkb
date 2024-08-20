/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Ad, Prisma, UserHasAds } from '@prisma/client';
// import { CreateAdDto } from './dto/create-ad.dto';
// import { UpdateAdDto } from './dto/update-ad.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { GetAdsCategoryDto } from './dto/get-ads-category.dto';
import { AdCreateForeignKeyInterface, AdCreateInputInterface } from './interface/ad.interface';
// import { GetAdsUserDto } from './dto/get-ads-user.dto';

@Injectable()
export class AdService {

  constructor(private prisma: PrismaService) {}

  async create(data: AdCreateInputInterface, foreignKeys: AdCreateForeignKeyInterface): Promise<Ad> {
    return await this.prisma.ad.create({
      data: {
        ...data,
        users: { connect: { id: foreignKeys.userId } },
        category: { connect: { id: foreignKeys.categoryId } },
        subCategory: { connect: { id: foreignKeys.subCategoryId } },
        }
    })
  }

  async findAll(): Promise<Ad[]> {
    return this.prisma.ad.findMany();
  }

  async findAllByParams(options: Prisma.AdFindManyArgs): Promise<Ad[]>{
    return this.prisma.ad.findMany({
      ...options,
      orderBy: {
        startTime: 'desc'
      }
    });
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

  async findAllByUser(userId: string): Promise<Ad[]>{
    return this.prisma.ad.findMany({
      where: {
        users: {
          id: userId
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

  async exist(
    adWhereUniqueInput: Prisma.AdWhereUniqueInput
  ): Promise<boolean> {
    return !!await this.prisma.ad.count({
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
  }

  async subscribeUserToAd(userId: string, adId: string): Promise<UserHasAds> {
    return this.prisma.userHasAds.create({
      data: {
        userId,
        adId,
        userAttendees: 1,
        status: 'true',
      },
    });
  }

  async getAllSubscriptionsByUserId(userId: string): Promise<UserHasAds[]> {
    return this.prisma.userHasAds.findMany({
      where: {
        userId: userId,
      },
      include: {
        ads: true,
      },
    });
  }

  async getAllSubscriptionsByUserParams(userId: string, params: { title?: string, city?: string }): Promise<UserHasAds[]> {
    return this.prisma.userHasAds.findMany({
      where: {
        userId: userId,
        ads: {
          OR: [
            { title:
              {
                contains: params.title
              }
            },
            { city:
              {
                contains: params.city
              }
            },
          ],
        },
      },
      include: {
        ads: true,
      },
    });
  }

  async updateUserAdSubscription(userId: string, adId: string, data: Prisma.UserHasAdsUpdateInput): Promise<UserHasAds> {
    return this.prisma.userHasAds.update({
      where: {
        userId_adId: { userId, adId },
      },
      data,
    });
  }

  async deleteUserAdSubscription(userId: string, adId: string): Promise<UserHasAds> {
    return this.prisma.userHasAds.delete({
      where: {
        userId_adId: { userId, adId },
      },
    });
  }
}