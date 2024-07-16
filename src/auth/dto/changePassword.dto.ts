/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, MinLength, MaxLength, IsAlpha } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ required: true })
    password: string;
}