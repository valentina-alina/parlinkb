/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ required: true })
    email: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ required: true })
    code: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ required: true })
    password: string;
}