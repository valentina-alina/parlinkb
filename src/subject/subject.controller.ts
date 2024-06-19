/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpStatus, HttpException } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { Prisma, Subject } from '@prisma/client';

@Controller('subject')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}
  

  @Post()
 async  create(@Body() inputDto: CreateSubjectDto) {

    const out = await this.subjectService.create(inputDto);
    const message = `New subject was created`;
    return {
        out,
        message
    };
   }


  @Get()
  async findAllByParams(@Query() query: {skip?: string, take?: string }): Promise<{out: Subject[], message: string}> {

  const prismaOptions: Prisma.SubjectFindManyArgs = {}
   query.skip? prismaOptions.skip = +query.skip : null
   query.take? prismaOptions.take = +query.take : null

    const out= await this.subjectService.findAllByParams(prismaOptions);
    const message = `All subjects`;
    return {
        out,
        message
    };
    
  }

  @Get(':id')
  async readRoute(@Param('id') id: string): Promise<{subject: Subject, message: string}> {
  
    const subject = await this.subjectService.findByUnique({ id });

    if (!subject) throw new HttpException('L\'utilisateur n\'a pas été trouvé', HttpStatus.CONFLICT)
    
    const message = `Subject avec l\'id ${id}`;
    return {
      subject,
      message
    };
  }

  @Patch(':id')
 async  update(@Param('id') id: string, @Body() inputDto: UpdateSubjectDto) : Promise<{out: Subject, message: string}> {

    const out= await this.subjectService.update({id}, inputDto);

    const message = `Subject avec l\'id ${id} a été mis a jour`;
    return {
      out,
      message
    };

  }


  @Delete(':id')
 async  remove(@Param('id') id: string) : Promise<{out: Subject, message: string}>{
  console.log('in remove')
   const out= await this.subjectService.delete({id});
    const message = `Subject avec l\'id ${id} a été supprimés`;
    return {
      out,
      message
    };
  }
}
