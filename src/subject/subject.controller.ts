/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpStatus, HttpException, Res, UseGuards } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { Prisma, Subject } from '@prisma/client';
import { AuthGuard } from '../guards/jwt.guards';

@UseGuards(AuthGuard)
@Controller('subject')
export class SubjectController {
  private readonly dataName = 'subject';

  constructor(private readonly service: SubjectService) {}

  @Post()
  async create(@Body() inputDto: CreateSubjectDto): Promise<{ [key: string]: Subject | string }> {
    const out = await this.service.create(inputDto);
    return {
      [this.dataName]: out,
      message: `New subject was created`,
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
    return {
      [this.dataName]: out,
      message: `Toutes les matières`,
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

    if (!out) throw new HttpException(`Le sujet n'a pas été trouvé`, HttpStatus.CONFLICT);
    
    return {
      [this.dataName]: out,
      message: `Matière avec l'id ${id}`,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() inputDto: UpdateSubjectDto): Promise<{ [key: string]: Subject | string }> {
    const out = await this.service.update({ id }, inputDto);
    return {
      [this.dataName]: out,
      message: `La matière avec l'id ${id} a été mise à jour`,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ subject?: Subject; message: string }> {
    const subject = await this.service.findByUnique({ id });

    if (!subject) {
      throw new HttpException(`Le sujet n'a pas été trouvé`, HttpStatus.NOT_FOUND);
    }

    const result = await this.service.delete({ id });

    if (typeof result === 'string') {
      // Si result est un message d'erreur, lancer une exception HTTP
      throw new HttpException(result, HttpStatus.CONFLICT);
    }

    return {
      subject: result,
      message: `La matière avec l'id ${id} a été supprimée`,
    };
  }
}