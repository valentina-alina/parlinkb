/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateSubCategoryDto } from './dto/create-subCategory.dto';
// import { UpdateSubCategoryDto } from './dto/update-subCategory.dto';
import { Prisma, SubCategory } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class SubCategoryService {

  constructor(private prisma: PrismaService) {}

  async create(data: CreateSubCategoryDto): Promise<SubCategory> {
    return this.prisma.subCategory.create({
      data: {
        name: data.name,
        category: {
          connect: {
            id: data.categoryId
          }
        }
      },
    })
  }

  async findAll(): Promise<SubCategory[]> {
    return this.prisma.subCategory.findMany();
  }

  async findAllSubCategoryNames(): Promise<string[]> {
    const subCategories = await this.prisma.subCategory.findMany({
      select: {
        name: true,
      },
    });

    return subCategories.map(subCategory => subCategory.name);
  }

  async findByUnique(
    subCategoryWhereUniqueInput: Prisma.SubCategoryWhereUniqueInput
  ): Promise<SubCategory | null> {
    return this.prisma.subCategory.findUnique({
      where: subCategoryWhereUniqueInput
    });
  }

  async update(
    where: Prisma.SubCategoryWhereUniqueInput,
    data: Prisma.SubCategoryUpdateInput
  ): Promise<SubCategory> {
    return this.prisma.subCategory.update({
      where,
      data,
    });
  }

  async delete(where: Prisma.SubCategoryWhereUniqueInput): Promise<SubCategory> {
    return this.prisma.subCategory.delete({
      where
    });
  }
}
