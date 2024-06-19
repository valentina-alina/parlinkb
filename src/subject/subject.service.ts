/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

import { Prisma, Subject } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PRISMA_ERRORS } from '../../prisma/prisma.errors';

@Injectable()
export class SubjectService {

 

  constructor(
    private readonly prisma: PrismaService,
  
  ) {}

  async create(inputDto: CreateSubjectDto): Promise<Subject | string> {
    try {
      const out = await this.prisma.subject.create({ data: { name: inputDto.name } });
      return out;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        const errorMessage = PRISMA_ERRORS[error.code] ? `Prisma error-${error.code}: ${PRISMA_ERRORS[error.code]}` : `Unexpected error: ${error.message}`;
        return errorMessage;
      }
      return `Unexpected error: ${error.message}`;
    }
  }

  async findAllByParams(options: Prisma.SubjectFindManyArgs): Promise<Subject[] | string> {
    try {
      return await this.prisma.subject.findMany(options);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        const errorMessage = PRISMA_ERRORS[error.code] ? `Prisma error-${error.code}: ${PRISMA_ERRORS[error.code]}` : `Unexpected error: ${error.message}`;
        return errorMessage;
      }
      return `Unexpected error: ${error.message}`;
    }
  }

  async findByUnique(WhereUniqueInput: Prisma.SubjectWhereUniqueInput): Promise<Subject | string> {
    try {
      const subject = await this.prisma.subject.findUnique({
        where: WhereUniqueInput,
      });
      return subject;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        const errorMessage = PRISMA_ERRORS[error.code] ? `Prisma error-${error.code}: ${PRISMA_ERRORS[error.code]}` : `Unexpected error: ${error.message}`;
        return errorMessage;
      }
      return `Unexpected error: ${error.message}`;
    }
  }

  async update(where: Prisma.SubjectWhereUniqueInput, data: Prisma.SubjectUpdateInput): Promise<Subject | string> {
    try {
      const output = await this.prisma.subject.update({
        where,
        data,
      });
      return output;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        const errorMessage = PRISMA_ERRORS[error.code] ? `Prisma error-${error.code}: ${PRISMA_ERRORS[error.code]}` : `Unexpected error: ${error.message}`;
        return errorMessage;
      }
      return `Unexpected error: ${error.message}`;
    }
  }

  async delete(where: Prisma.SubjectWhereUniqueInput): Promise<Subject | string> {
    try {
      const output = await this.prisma.subject.delete({
        where,
      });
      return output;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        const errorMessage = PRISMA_ERRORS[error.code] ? `Prisma error-${error.code}: ${PRISMA_ERRORS[error.code]}` : `Unexpected error: ${error.message}`;
        return errorMessage;
      }
      return `Unexpected error: ${error.message}`;
    }
  }
}
