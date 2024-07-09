/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { PRISMA_ERRORS } from '../../prisma/prisma.errors';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

  constructor(private prisma: PrismaService) {}

  // async hashPassword(password: string): Promise<string> {
  //   const salt = await bcrypt.genSalt(10);
  //   return bcrypt.hash(password, salt);
  // }
  async create(data: CreateUserDto): Promise<User> {
    console.log(data);
 
    const user = await this.prisma.user.create(
      {data: {role : data.role, firstName : data.firstName, lastName: data.lastName, email :data.email, password:data.password}}
    );

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

  // async findAllByParams(options: Prisma.UserFindManyArgs): Promise<User[]>{
  //   return this.prisma.user.findMany(options);
  // }
  async findAllByParams(options: Prisma.UserFindManyArgs): Promise<User[] | string> {
    try {
      return await this.prisma.user.findMany(options);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        const errorMessage = PRISMA_ERRORS[error.code] ? `Prisma error-${error.code}: ${PRISMA_ERRORS[error.code]}` : `Unexpected error: ${error.message}`;
        return errorMessage;
      }
      return `Unexpected error: ${error.message}`;
    }
  }

  async update(
      where: Prisma.UserWhereUniqueInput,
      data: Prisma.UserUpdateInput
    ): Promise<User> {
      // if (data.password) {
      //   data.password = await this.hashPassword(data.password);}
      return this.prisma.user.update({
        where,
        data,
      });
  }
  
  async delete(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    })
  }
  
  async deleteByUserId(userId: string): Promise<{ message: string }> {
    try {
      await this.prisma.user.delete({
        where: { id: userId
        }
      });
      const message = 'UserHasSubject records deleted for user ID';
      return { message: message };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        const errorMessage = PRISMA_ERRORS[error.code]
          ? `Prisma error-${error.code}: ${PRISMA_ERRORS[error.code]}`
          : `Unexpected error: ${error.message}`;
        return { message: errorMessage };
      }
      const message = `Unexpected error: ${error.message}`;
      return { message: message };
    }}
 
  }
