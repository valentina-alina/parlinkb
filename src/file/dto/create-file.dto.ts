/* eslint-disable prettier/prettier */

import { $Enums } from "@prisma/client";


export class CreateFileDto {

    filePath: string;
    fileType: $Enums.FileType;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
}
