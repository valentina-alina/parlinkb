/* eslint-disable prettier/prettier */

import { $Enums } from "@prisma/client"

export interface AdCreateInputInterface  {
    id?: string
    title: string
    description: string
    startTime?: Date | string | null
    endTime?: Date | string | null
    duration?: number | null
    address: string
    postalCode: string
    city: string
    country: string
    attendees?: number | null
    transport?: $Enums.Transport | null
    conform?: boolean | null
    status?: $Enums.AdStatus | null
    adPicture?: string | null
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    adHasFile?: any
    userHasAd?: any
}

export interface AdCreateForeignKeyInterface {
    userId: string;
    categoryId: string;
    subCategoryId: string;
}