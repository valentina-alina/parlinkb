/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, Put, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { SubCategoryService } from './subCategory.service';
import { CreateSubCategoryDto } from './dto/create-subCategory.dto';
import { UpdateSubCategoryDto } from './dto/update-subCategory.dto';
import { SubCategory } from '@prisma/client';

@Controller('sub-category')
export class SubCategoryController {
  constructor(private readonly subCategoryService: SubCategoryService) {}

  @Post()
  async create(@Body() data: CreateSubCategoryDto): Promise<{subCategory: SubCategory, message: string}> {

    const subCategory = await this.subCategoryService.findByUnique({
      name : data.name
    })

    if (!subCategory) throw new HttpException(`La sous-catégorie n'existe pas`, HttpStatus.CONFLICT)

    const new_subCategory = await this.subCategoryService.create(data);

    return {
      subCategory: new_subCategory,
      message: `Sous-catégorie créée`
    }
  }

  @Get()
  async findAll(): Promise<{ subCategories: string[], message: string }> {
    const subCategories = await this.subCategoryService.findAllSubCategoryNames();

    if (!subCategories) throw new HttpException('La liste de sous-catégories n\'a pas été trouvée', HttpStatus.CONFLICT)

    return {
      subCategories,
      message: 'Liste des noms des sous-catégories',
    };
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string
  ): Promise<{subCategory: SubCategory, message: string}> {
    const subCategory = await this.subCategoryService.findByUnique({ id });

    if (!subCategory) throw new HttpException('La sous-catégorie n\'a pas été trouvée', HttpStatus.CONFLICT)

    return {
      subCategory,
      message: `Sous-catégorie avec l'id ${id}`
    };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSubCategoryDto: UpdateSubCategoryDto
  ): Promise<{subCategory: SubCategory, message: string}> {
    const subCategory = await this.subCategoryService.findByUnique({ id });
      
    if (!subCategory) throw new HttpException('La sous-catégorie n\'a pas été trouvée', HttpStatus.CONFLICT)

    const subCategoryUpdate = await this.subCategoryService.update({ id },updateSubCategoryDto);

    return {
      subCategory: subCategoryUpdate,
      message: `La sous-catégorie avec l'id ${id} a bien été mise à jour`
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<SubCategory | { message: string}> {
    const subCategory = await this.subCategoryService.findByUnique({ id })

    if(!subCategory) throw new HttpException('La sous-catégorie n\'a pas été trouvée', HttpStatus.CONFLICT)

    this.subCategoryService.delete({ id });

    return {
      message: `La sous-catégorie avec l'id ${id} a bien été supprimée`
    }
  }
}
