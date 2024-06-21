/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpStatus, HttpException, Res } from '@nestjs/common';
import {UserHasSubjectService } from './userHasSubject.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { Prisma,UserHasSubjects } from '@prisma/client';
import { CreateUHSDto } from './dto/userHasSubjectdto';

@Controller('uhs')
export class UserHasSubjectController {
  private readonly dataName = 'subject';

  constructor(private readonly service: UserHasSubjectService) {}

  @Post()
  async create(@Body() inputDto: CreateUHSDto): Promise<{ [key: string]: UserHasSubjects | string }> {
    // const out = await this.service.create(inputDto);
    const new_user_has_subject = await this.service.create(inputDto);

    console.log(`🚀 User has subject : ${new_user_has_subject}`);
    return new_user_has_subject;
  }

  @Delete('delete')
  async delete(@Body() deleteUHSDto: CreateUHSDto): Promise<{ message: string }> {
    const result = await this.service.delete(deleteUHSDto);
    if (result.message.includes('error')) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }
    return result;
  }
  @Delete('delete/:userId')
  async deleteByUserId(@Param('userId') userId: string): Promise<{ message: string }> {
    try {
      const result = await this.service.deleteByUserId(userId);
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}

