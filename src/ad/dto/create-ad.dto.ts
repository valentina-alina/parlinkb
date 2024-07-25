/* eslint-disable prettier/prettier */

import { Transport, AdStatus } from "@prisma/client";
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional } from "class-validator";

export class CreateAdDto {

    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    description: string;

    @IsOptional()
    startTime?: Date;

    @IsOptional()
    endTime?: Date;

    @IsOptional()
    duration?: number;

    @IsNotEmpty()
    address: string;

    @IsNotEmpty()
    postalCode: string;

    @IsNotEmpty()
    city: string;

    @IsNotEmpty()
    country: string;

    @IsOptional()
    attendees?: number;

    @IsEnum(Transport)
    transport?: Transport;

    @IsBoolean()
    conform?: boolean;

    @IsEnum(AdStatus)
    status?: AdStatus;

    adPicture?: string;

    @IsNotEmpty()
    userId: string;

    @IsNotEmpty()
    categoryId: string;

    @IsNotEmpty()
    subCategoryId: string;

    @IsOptional()
    adHasFile?: null; 

    @IsOptional()
    userHasAd?: null;
}
