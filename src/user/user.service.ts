/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class UserService {

  private users : User[] = [];
  
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data,
    })
  }

  async findByFirstName(firstName: string): Promise<User | null> {
    return this.prisma.user.findFirst({
        where: {
          firstName: firstName
        },
    });
  }

  async findByPassword(password: string): Promise<User | null> {
    return this.prisma.user.findFirst({
        where: {
          password: password
        },
    });
  }

  async findByUnique(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput
    });
  }

  async findByRefreshToken(
    refreshToken: string
  ): Promise<User> {
    return this.prisma.user.findFirst(
      {where:
        {
          refreshToken
        }
      }
    );
  }

  async findAllByParams(options: Prisma.UserFindManyArgs): Promise<User[]>{
    return this.prisma.user.findMany(options);
  }

  async update(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput
  ): Promise<User> {
    return this.prisma.user.update({
      where,
      data,
    });
  }

  async delete(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    })
  };
}