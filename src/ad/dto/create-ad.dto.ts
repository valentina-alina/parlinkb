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

    @IsOptional()
    address?: string;

    @IsOptional()
    postalCode?: string;

    @IsOptional()
    city?: string;

    @IsOptional()
    country?: string;

    @IsOptional()
    attendees?: number;

    @IsNotEmpty()
    lat: string;

    @IsNotEmpty()
    lng: string;

    @IsEnum(Transport)
    transport?: Transport;

    @IsBoolean()
    conform?: boolean;

    @IsEnum(AdStatus)
    status?: AdStatus;

    adPicture?: string;

    @IsNotEmpty()
    userId: string;

    @IsOptional()
    categoryId?: string;

    @IsOptional()
    subCategoryId?: string;

    @IsOptional()
    adHasFile?: null; 

    @IsOptional()
    userHasAd?: null;
}
