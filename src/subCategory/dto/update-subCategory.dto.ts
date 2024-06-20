/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/swagger';
import { CreateSubCategoryDto } from './create-subCategory.dto';

export class UpdateSubCategoryDto extends PartialType(CreateSubCategoryDto) {}
