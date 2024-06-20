import { Module } from '@nestjs/common';
import { SubCategoryService } from './subCategory.service';
import { SubCategoryController } from './subCategory.controller';

@Module({
  controllers: [SubCategoryController],
  providers: [SubCategoryService],
})
export class SubCategoryModule {}
