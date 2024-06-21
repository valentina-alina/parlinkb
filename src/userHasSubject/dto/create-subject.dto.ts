/* eslint-disable prettier/prettier */

import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { Subject } from '@prisma/client';

//TODO:
export class CreateSubjectDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ required: true })
    name: string;
}
