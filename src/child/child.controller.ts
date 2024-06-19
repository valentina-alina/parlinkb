/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpStatus, HttpException } from '@nestjs/common';
import { ChildService } from './child.service';
import { CreateChildDto } from './dto/create-child.dto';
import { UpdateChildDto } from './dto/update-child.dto';
import { Prisma, Child } from '@prisma/client';

@Controller('child')
export class ChildController {
  private readonly dataName = 'child';

  constructor(private readonly service: ChildService) {}

  @Post()
  async create(@Body() inputDto: CreateChildDto): Promise<{ [key: string]: Child | string }> {
    const out = await this.service.create(inputDto);
    const message = 'New child was created';
    return {
      [this.dataName]: out,
      message,
    };
  }


  @Get()
  async findAllByParams(@Query() query: { skip?: string, take?: string }): Promise<{ [key: string]: Child[] | string }> {
    const prismaOptions: Prisma.ChildFindManyArgs = {};
    if (query.skip) prismaOptions.skip = +query.skip;
    if (query.take) prismaOptions.take = +query.take;

    const out = await this.service.findAllByParams(prismaOptions);
    const message = `All childs`;
    return {
      [this.dataName]: out,
      message
    };
  }

  @Get(':id')
  async readRoute(@Param('id') id: string): Promise<{ [key: string]: Child | string }> {
    const out = await this.service.findByUnique({ id });

    if (!out) throw new HttpException('Le sujet n\'a pas été trouvé', HttpStatus.CONFLICT);
    
    const message = `Child avec l'id ${id}`;
    return {
      [this.dataName]: out,
      message
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() inputDto: UpdateChildDto): Promise<{ [key: string]: Child | string }> {
    const out = await this.service.update({ id }, inputDto);
    const message = `Child avec l'id ${id} a été mis à jour`;
    return {
      [this.dataName]: out,
      message
    };
  }

  // @Delete(':id')
  // async remove(@Param('id') id: string): Promise<Child | string> {
  //   const child = await this.service.findByUnique({ id });

  //   if (!child) throw new HttpException('Le sujet n\'a pas été trouvé', HttpStatus.CONFLICT);

  //   const out = await this.service.delete({ id });

  //   const message = `Child avec l'id ${id} a été supprimé`;
  //   return {out, 
  //     message
  //   };
  // }
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ child?: Child; message: string }> {
    const child = await this.service.findByUnique({ id });

    if (!child) {
      throw new HttpException('Le sujet n\'a pas été trouvé', HttpStatus.NOT_FOUND);
    }

    const result = await this.service.delete({ id });

    if (typeof result === 'string') {
      // Si result est un message d'erreur, lancer une exception HTTP
      throw new HttpException(result, HttpStatus.CONFLICT);
    }

    const message = `Child avec l'id ${id} a été supprimé`;
    return { child: result, message };
  }
}

