/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateSubCategoryDto {
    
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    ads?: null;

    @IsNotEmpty()
    @IsString()
    categoryId: string;
}
