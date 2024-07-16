/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({ required: true })
    email: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ required: true })
    password: string;
}