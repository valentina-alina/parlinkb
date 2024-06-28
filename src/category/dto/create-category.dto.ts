/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCategoryDto {
    
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    ads?: null;

    @IsOptional()
    subCategory?: null;
}