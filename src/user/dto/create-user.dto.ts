/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { IsNotEmpty, IsEmail, IsString, MinLength, MaxLength, IsAlpha } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ required: true })
    role: UserRole;

    @IsNotEmpty()
    @IsString()
    @MinLength(2, { message: 'Le prénom doit comporter plus 2 caractères'})
    @MaxLength(20, { message: 'Le prénom doit comporter moins de 20 caractères'})
    @IsAlpha()
    @ApiProperty({ required: true })
    firstName: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(2, { message: 'Le nom doit comporter plus 2 caractères'})
    @MaxLength(20, { message: 'Le nom doit comporter moins de 20 caractères'})
    @IsAlpha()
    @ApiProperty({ required: true })
    lastName: string;

    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({ required: true })
    email: string;

   
    @IsString()
    @MinLength(4, { message: 'Le mot de passe doit comporter plus 4 caractères'})
    @MaxLength(20, { message: 'Le mot de passe doit comporter moins de 20 caractères'})
    @ApiProperty({ required: true })
    password: string;
}