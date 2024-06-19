/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { da } from '@faker-js/faker';

@Injectable()
export class UserService {
  private readonly CACHE_TTL = 3600; // Cache TTL in seconds

  constructor(
    private readonly prisma: PrismaService,
    private readonly cacheService: CacheService
  ) {}

  async create(data: CreateUserDto): Promise<User> {
    const user = await this.prisma.user.create(
      {data: {role : data.role, firstName : data.firstName, lastName: data.lastName, email :data.email, password:data.password}}
    );
    await this.cacheService.set(`user:${user.id}`, user, this.CACHE_TTL);
    return user;
  }

  async findByFirstName(firstName: string): Promise<User | null> {
    const cacheKey = `user:firstName:${firstName}`;
    let user = await this.cacheService.get(cacheKey);
    if (!user) {
      user = await this.prisma.user.findFirst({
        where: { firstName },
      });
      if (user) {
        await this.cacheService.set(cacheKey, user, this.CACHE_TTL);
      }
    }
    return user;
  }

  async findByPassword(password: string): Promise<User | null> {
    const cacheKey = `user:password:${password}`;
    let user = await this.cacheService.get(cacheKey);
    if (!user) {
      user = await this.prisma.user.findFirst({
        where: { password },
      });
      if (user) {
        await this.cacheService.set(cacheKey, user, this.CACHE_TTL);
      }
    }
    return user;
  }

  async findByUnique(userWhereUniqueInput: Prisma.UserWhereUniqueInput): Promise<User | null> {
    const cacheKey = `user:unique:${JSON.stringify(userWhereUniqueInput)}`;
    let user = await this.cacheService.get(cacheKey);
    if (!user) {
      user = await this.prisma.user.findUnique({
        where: userWhereUniqueInput,
      });
      if (user) {
        await this.cacheService.set(cacheKey, user, this.CACHE_TTL);
      }
    }
    return user;
  }

  async findByRefreshToken(refreshToken: string): Promise<User> {
    const cacheKey = `user:refreshToken:${refreshToken}`;
    let user = await this.cacheService.get(cacheKey);
    if (!user) {
      user = await this.prisma.user.findFirst({
        where: { refreshToken },
      });
      if (user) {
        await this.cacheService.set(cacheKey, user, this.CACHE_TTL);
      }
    }
    return user;
  }

  async findAllByParams(options: Prisma.UserFindManyArgs): Promise<User[]> {
    const cacheKey = `user:params:${JSON.stringify(options)}`;
    let users = await this.cacheService.get(cacheKey);
    if (!users) {
      users = await this.prisma.user.findMany(options);
      await this.cacheService.set(cacheKey, users, this.CACHE_TTL);
    }
    return users;
  }

  async update(where: Prisma.UserWhereUniqueInput, data: Prisma.UserUpdateInput): Promise<User> {
    const user = await this.prisma.user.update({
      where,
      data,
    });
    await this.cacheService.set(`user:${user.id}`, user, this.CACHE_TTL);
    return user;
  }

  async delete(where: Prisma.UserWhereUniqueInput): Promise<User> {
    const user = await this.prisma.user.delete({
      where,
    });
    await this.cacheService.del(`user:${user.id}`);
    return user;
  }
 
}