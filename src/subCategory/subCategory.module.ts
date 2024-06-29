/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { SubCategoryService } from './subCategory.service';
import { SubCategoryController } from './subCategory.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SubCategoryController],
  providers: [SubCategoryService],
})
export class SubCategoryModule {}
