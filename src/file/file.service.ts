/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';

import { Prisma, File } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PRISMA_ERRORS } from '../../prisma/prisma.errors';

@Injectable()
export class FileService {
 

  constructor(
    private readonly prisma: PrismaService,
  
  ) {}
// inputDto doit avoir la meme structure que  File de Promise sinon ça ne marche pas
  async create(inputDto: CreateFileDto): Promise<File | string> {
    try {
      const out = await this.prisma.file.create({ 
        data: inputDto
      });
      return out;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        const errorMessage = PRISMA_ERRORS[error.code]
          ? `Prisma error-${error.code}: ${PRISMA_ERRORS[error.code]}`
          : `Unexpected error: ${error.message}`;
        return errorMessage;
      }
      return `Unexpected error: ${error.message}`;
    }
  }

  async findAllByParams(options: Prisma.FileFindManyArgs): Promise<File[] | string> {
    try {
      return await this.prisma.file.findMany(options);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        const errorMessage = PRISMA_ERRORS[error.code] ? `Prisma error-${error.code}: ${PRISMA_ERRORS[error.code]}` : `Unexpected error: ${error.message}`;
        return errorMessage;
      }
      return `Unexpected error: ${error.message}`;
    }
  }

  async findByUnique(whereUniqueInput: Prisma.FileWhereUniqueInput): Promise<File | string> {
    try {
      const out= await this.prisma.file.findUnique({
        where: whereUniqueInput,
      });
      return out
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        const errorMessage = PRISMA_ERRORS[error.code] ? `Prisma error-${error.code}: ${PRISMA_ERRORS[error.code]}` : `Unexpected error: ${error.message}`;
        return errorMessage;
      }
      return `Unexpected error: ${error.message}`;
    }
  }

  async update(where: Prisma.FileWhereUniqueInput, data: Prisma.FileUpdateInput): Promise<File | string> {
    try {
      const out = await this.prisma.file.update({
        where,
        data,
      });
      return out;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        const errorMessage = PRISMA_ERRORS[error.code] ? `Prisma error-${error.code}: ${PRISMA_ERRORS[error.code]}` : `Unexpected error: ${error.message}`;
        return errorMessage;
      }
      return `Unexpected error: ${error.message}`;
    }
  }

  async delete(where: Prisma.FileWhereUniqueInput): Promise<File | string> {
    try {
      const output = await this.prisma.file.delete({
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

