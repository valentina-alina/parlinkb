/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpStatus, HttpException, Res } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { Prisma, Subject } from '@prisma/client';

@Controller('subject')
export class SubjectController {
  private readonly dataName = 'subject';

  constructor(private readonly service: SubjectService) {}

  @Post()
  async create(@Body() inputDto: CreateSubjectDto): Promise<{ [key: string]: Subject | string }> {
    const out = await this.service.create(inputDto);
    const message = `New subject was created`;
    return {
      [this.dataName]: out,
      message
    };
  }


  @Get()
  async findAllByParams(@Query() query: { skip?: string, take?: string, name?: string }): Promise<{ [key: string]: Subject[] | string }> {
    const prismaOptions: Prisma.SubjectFindManyArgs = {
      where: {}
    };
    
    if (query.skip) prismaOptions.skip = +query.skip;
    if (query.take) prismaOptions.take = +query.take;
    if (query.name) {
      prismaOptions.where = {
        ...prismaOptions.where,
        name: {
          contains: query.name
    
        }
      };
    }

    const out = await this.service.findAllByParams(prismaOptions);
    const message = `All subjects`;
    return {
      [this.dataName]: out,
      message
    };
  }
  @Get('')
  async findByName(@Query('name') subName: string, @Res() res: Response) {
    

    const result = await this.service.findByUnique({name: subName
    });

    return result
  }


  @Get(':id')
  async readRoute(@Param('id') id: string): Promise<{ [key: string]: Subject | string }> {
    const out = await this.service.findByUnique({ id });

    if (!out) throw new HttpException('Le sujet n\'a pas été trouvé', HttpStatus.CONFLICT);
    
    const message = `Subject avec l'id ${id}`;
    return {
      [this.dataName]: out,
      message
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() inputDto: UpdateSubjectDto): Promise<{ [key: string]: Subject | string }> {
    const out = await this.service.update({ id }, inputDto);
    const message = `Subject avec l'id ${id} a été mis à jour`;
    return {
      [this.dataName]: out,
      message
    };
  }


  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ subject?: Subject; message: string }> {
    const subject = await this.service.findByUnique({ id });

    if (!subject) {
      throw new HttpException('Le sujet n\'a pas été trouvé', HttpStatus.NOT_FOUND);
    }

    const result = await this.service.delete({ id });

    if (typeof result === 'string') {
      // Si result est un message d'erreur, lancer une exception HTTP
      throw new HttpException(result, HttpStatus.CONFLICT);
    }

    const message = `Subject avec l'id ${id} a été supprimé`;
    return { subject: result, message };
  }
}

