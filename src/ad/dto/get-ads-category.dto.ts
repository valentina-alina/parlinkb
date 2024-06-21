/* eslint-disable prettier/prettier */

import { IsOptional, IsString } from "class-validator";

export class GetAdsCategoryDto {

    @IsString()
    @IsOptional()
    categoryName?: string | null;

    @IsString()
    @IsOptional()
    subCategoryName?: string | null;
}