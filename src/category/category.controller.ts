/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Put, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from '@prisma/client';


//TODO: CREATE CATEGORY | SUBCATEGORY
//TODO: READ ALL CATEGORIES | SUBCATEGORIES
//TODO: READ CATEGORY | SUBCATEGORY BY PARAMS [FINDBYPARAMS]  -->  UPDATE | DELETE [FINDBYPARAMS]
//TODO: READ CATEGORY | SUBCATEGORY BY ID [FINDBYID] -->  UPDATE | DELETE [FINDBYID]
//TODO: UPDATE CATEGORIES | SUBCATEGORIES
//TODO: DELETE CATEGORIES | SUBCATEGORIES

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(@Body() data: CreateCategoryDto): Promise<{category: Category, message: string}> {

    const category = await this.categoryService.findByUnique({
      name : data.name
    })

    if (!category) throw new HttpException(`L'utilisateur n'existe pas`, HttpStatus.CONFLICT)

    const new_category = await this.categoryService.create(data);

    return {
      category: new_category,
      message: `Catégorie créée`
    }
  }

  @Get()
  async findAll(): Promise<{ categories: string[], message: string }> {
    const categories = await this.categoryService.findAllCategoryNames();

    if (!categories) throw new HttpException('La liste de catégories n\'a pas été trouvée', HttpStatus.CONFLICT)

    return {
      categories,
      message: 'Liste des noms des catégories',
    };
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string
  ): Promise<{category: Category, message: string}> {
    const category = await this.categoryService.findByUnique({ id });

    if (!category) throw new HttpException('La catégorie n\'a pas été trouvée', HttpStatus.CONFLICT)

    return {
      category,
      message: `Catégorie avec l'id ${id}`
    };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto
  ): Promise<{category: Category, message: string}> {
    const category = await this.categoryService.findByUnique({ id });
      
      if (!category) throw new HttpException('La catégorie n\'a pas été trouvée', HttpStatus.CONFLICT)

      const categoryUpdate = await this.categoryService.update({ id },updateCategoryDto);

      return {
        category: categoryUpdate,
        message: `La catégorie avec l'id ${id} a bien été mise à jour`
      }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Category | { message: string}> {
    const ad = await this.categoryService.findByUnique({ id })

    if(!ad) throw new HttpException('La catégorie n\'a pas été trouvée', HttpStatus.CONFLICT)

    this.categoryService.delete({ id });

    return {
      message: `La catégorie avec l'id ${id} a bien été supprimée`
    }
  }
}
