/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Category, Prisma } from '@prisma/client';
// import { CreateCategoryDto } from './dto/create-category.dto';
// import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CategoryService {

  constructor(private prisma: PrismaService) {}
  
  async create(data: Prisma.CategoryCreateInput): Promise<Category> {
    return this.prisma.category.create({
      data,
  })
  }

  async findAll(): Promise<Category[]> {
    return this.prisma.category.findMany();
  }

  async findByUnique(
    categoryWhereUniqueInput: Prisma.CategoryWhereUniqueInput
  ): Promise<Category | null> {
    return this.prisma.category.findUnique({
      where: categoryWhereUniqueInput
    });
  }

  async update(
    where: Prisma.CategoryWhereUniqueInput,
    data: Prisma.CategoryUpdateInput
  ): Promise<Category> {
    return this.prisma.category.update({
      where,
      data,
    });
  }

  async delete(where: Prisma.CategoryWhereUniqueInput): Promise<Category> {
    return this.prisma.category.delete({
      where
    });
  }
}