/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service'
import { PrismaService } from '../../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { da } from '@faker-js/faker';
import { PRISMA_ERRORS } from '../../prisma/prisma.errors';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class UserService {

  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data,
    })
    const user = await this.prisma.user.create(
      {data: {role : data.role, firstName : data.firstName, lastName: data.lastName, email :data.email, password:data.password}}
    );
    await this.cacheService.set(`user:${user.id}`, user, this.CACHE_TTL);
    return user;
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
    });
    await this.cacheService.del(`user:${user.id}`);
    return user;
  }
  
  async deleteByUserId(userId: string): Promise<{ message: string }> {
    try {
      await this.prisma.user.delete({
        where: { id: userId
        }
      });
      let message = 'UserHasSubject records deleted for user ID';
      return { message: message };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        const errorMessage = PRISMA_ERRORS[error.code]
          ? `Prisma error-${error.code}: ${PRISMA_ERRORS[error.code]}`
          : `Unexpected error: ${error.message}`;
        return { message: errorMessage };
      }
      let message = `Unexpected error: ${error.message}`;
      return { message: message };
    }}
 
}