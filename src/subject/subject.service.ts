/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

import { CacheService } from '../cache/cache.service';
import { Prisma, Subject} from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';




//TODO:
@Injectable()
export class SubjectService {

  private readonly CACHE_TTL = 3600; // Cache TTL in seconds

  constructor(
    private readonly prisma: PrismaService,
    // private readonly cacheService: CacheService
  ) {}

  async create(input: CreateSubjectDto): Promise<Subject>{
    const output = await this.prisma.subject.create(
      {data: {name : input.name}});
       return output;
  }
  
  async findAllByParams(options: Prisma.SubjectFindManyArgs): Promise<Subject[]> {
    // const cacheKey = `suject:params:${JSON.stringify(options)}`;
    // let subjects = await this.cacheService.get(cacheKey);
    if (!options) {
      // subjects = await this.prisma.subject.findMany();
      // await this.cacheService.set(cacheKey, subjects, this.CACHE_TTL);
    }
    return await this.prisma.subject.findMany(options);
  }

  async findByUnique(subjectWhereUniqueInput: Prisma.SubjectWhereUniqueInput): Promise<Subject> {
    // const cacheKey = `user:unique:${JSON.stringify(userWhereUniqueInput)}`;
    // let user = await this.cacheService.get(cacheKey);
    // if (!user) {
    const subject = await this.prisma.subject.findUnique({
        where: subjectWhereUniqueInput,
      });
      // if (subject) {
      //   await this.cacheService.set(cacheKey, user, this.CACHE_TTL);
      // }
       return subject; }



  async update(where: Prisma.SubjectWhereUniqueInput, data: Prisma.SubjectUpdateInput): Promise<Subject> {
    const output= await this.prisma.subject.update({
      where,
      data,
    });
    // await this.cacheService.set(`subjects:${output.id}`, output, this.CACHE_TTL);
    return output;
  }

  async delete(where: Prisma.SubjectWhereUniqueInput): Promise<Subject> {
    const output = await this.prisma.subject.delete({
      where,
    });
    // await this.cacheService.del(`subjects:${output.id}`);
    return output;
  }
  // findAll() {
  //   return `This action returns all subject`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} subject`;
  // }

  // update(id: number, updateSubjectDto: UpdateSubjectDto) {
  //   return `This action updates a #${id} subject`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} subject`;
  // }
}
