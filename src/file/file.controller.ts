/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpStatus, HttpException } from '@nestjs/common';
import { FileService } from './file.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { Prisma, File } from '@prisma/client';

@Controller('file')
export class FileController {
  private readonly dataName = 'file';

  constructor(private readonly service: FileService) {}

  @Post()
  async create(@Body() inputDto: CreateFileDto): Promise<{ [key: string]: File | string }> {
    const out = await this.service.create(inputDto);
    const message = 'New file was created';
    return {
      [this.dataName]: out,
      message,
    };
  }


  @Get()
  async findAllByParams(@Query() query: { skip?: string, take?: string }): Promise<{ [key: string]: File[] | string }> {
    const prismaOptions: Prisma.FileFindManyArgs = {};
    if (query.skip) prismaOptions.skip = +query.skip;
    if (query.take) prismaOptions.take = +query.take;

    const out = await this.service.findAllByParams(prismaOptions);
    const message = `All files`;
    return {
      [this.dataName]: out,
      message
    };
  }

  @Get(':id')
  async readRoute(@Param('id') id: string): Promise<{ [key: string]: File | string }> {
    const out = await this.service.findByUnique({ id });

    if (!out) throw new HttpException('Le sujet n\'a pas été trouvé', HttpStatus.CONFLICT);
    
    const message = `File avec l'id ${id}`;
    return {
      [this.dataName]: out,
      message
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() inputDto: UpdateFileDto): Promise<{ [key: string]: File | string }> {
    const out = await this.service.update({ id }, inputDto);
    const message = `File avec l'id ${id} a été mis à jour`;
    return {
      [this.dataName]: out,
      message
    };
  }

  // @Delete(':id')
  // async remove(@Param('id') id: string): Promise<File | string> {
  //   const file = await this.service.findByUnique({ id });

  //   if (!file) throw new HttpException('Le sujet n\'a pas été trouvé', HttpStatus.CONFLICT);

  //   const out = await this.service.delete({ id });

  //   const message = `File avec l'id ${id} a été supprimé`;
  //   return {out, 
  //     message
  //   };
  // }
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ file?: File; message: string }> {
    const file = await this.service.findByUnique({ id });

    if (!file) {
      throw new HttpException('Le sujet n\'a pas été trouvé', HttpStatus.NOT_FOUND);
    }

    const result = await this.service.delete({ id });

    if (typeof result === 'string') {
      // Si result est un message d'erreur, lancer une exception HTTP
      throw new HttpException(result, HttpStatus.CONFLICT);
    }

    const message = `File avec l'id ${id} a été supprimé`;
    return { file: result, message };
  }
}

