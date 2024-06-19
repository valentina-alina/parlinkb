/* eslint-disable prettier/prettier */

import { IsOptional, IsString } from "class-validator";

export class GetAdsCategoryDto {

    @IsString()
    categoryName: string;

    @IsString()
    @IsOptional()
    subCategoryName?: string | null;
}