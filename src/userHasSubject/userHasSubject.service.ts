/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Prisma, UserHasSubjects } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PRISMA_ERRORS } from '../../prisma/prisma.errors';
import { CreateUHSDto } from './dto/userHasSubjectdto';


@Injectable()
export class UserHasSubjectService {
 

  constructor(
    private readonly prisma: PrismaService,
  
  ) {}
  async create(inputDto: CreateUHSDto): Promise<{userHasSubject?:UserHasSubjects , message:string}> {
    try {
      const userHasSubject= await this.prisma.userHasSubjects.create({ 
        data: inputDto
      });
      let message ='UserHasSubject created';
       return {userHasSubject, message : message};
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        const errorMessage = PRISMA_ERRORS[error.code]
          ? `Prisma error-${error.code}: ${PRISMA_ERRORS[error.code]}`
          : `Unexpected error: ${error.message}`;
       

       return { message :  errorMessage};
      }
     
       let message = `Unexpected error: ${error.message}`;
       return { message :  message};
    }
   
  }

  // async findAllByParams(options: Prisma.ChildFindManyArgs): Promise<Child[] | string> {
  //   try {
  //     return await this.prisma.child.findMany(options);
  //   } catch (error) {
  //     if (error instanceof PrismaClientKnownRequestError) {
  //       const errorMessage = PRISMA_ERRORS[error.code] ? `Prisma error-${error.code}: ${PRISMA_ERRORS[error.code]}` : `Unexpected error: ${error.message}`;
  //       return errorMessage;
  //     }
  //     return `Unexpected error: ${error.message}`;
  //   }
  // }

  // async findAllByFilters(data: CreateChildDto): Promise<Child[]>{
  //   return this.prisma.child.findMany({
  //     where: {
  //       AND: [
  //         {
  //           firstName: {contains : data.firstName}
  //           }
  //         ,
  //         {
  //           lastName:  {contains : data.lastName}
  //           }
  //         ,
  //         {
  //          class:  {contains : data.class}
  //           }
  //         ,
  //         {
  //           school:  {contains : data.school}
  //          }
  //       ]
  //     }
  //   })
  // } 

  // async findByUnique(whereUniqueInput: Prisma.ChildWhereUniqueInput): Promise<Child | string> {
  //   try {
  //     const out= await this.prisma.child.findUnique({
  //       where: whereUniqueInput,
  //     });
  //     return out
  //   } catch (error) {
  //     if (error instanceof PrismaClientKnownRequestError) {
  //       const errorMessage = PRISMA_ERRORS[error.code] ? `Prisma error-${error.code}: ${PRISMA_ERRORS[error.code]}` : `Unexpected error: ${error.message}`;
  //       return errorMessage;
  //     }
  //     return `Unexpected error: ${error.message}`;
  //   }
  // }

 
// TODO corriger

  // async delete(where: Prisma.ChildWhereUniqueInput): Promise<UserHasSubjects | string> {
  //   try {
  //     const output = await this.prisma.child.delete({
  //       where,
  //     });
  //     return output;
  //   } catch (error) {
  //     if (error instanceof PrismaClientKnownRequestError) {
  //       const errorMessage = PRISMA_ERRORS[error.code] ? `Prisma error-${error.code}: ${PRISMA_ERRORS[error.code]}` : `Unexpected error: ${error.message}`;
  //       return errorMessage;
  //     }
  //     return `Unexpected error: ${error.message}`;
  //   }
  // }
}

