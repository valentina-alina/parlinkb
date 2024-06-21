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

  async delete(inputDto:CreateUHSDto): Promise<{ message: string }> {
    try {
      const { userId, subjectId } = inputDto;
      await this.prisma.userHasSubjects.delete({
        where: {
          userId_subjectId: { userId, subjectId }
        }
      });
      let message = 'UserHasSubject deleted';
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
    }
    
  }
  async deleteByUserId(userId: string): Promise<{ message: string }> {
    try {
      await this.prisma.userHasSubjects.deleteMany({
        where: {userId: userId
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
    // TODO find bi userID
    // TODO find by suject ID

}