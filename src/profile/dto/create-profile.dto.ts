/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, MaxLength, IsAlpha, Matches } from 'class-validator';

export class CreateProfileDto {



    @IsNotEmpty()
    @IsString()
    @Matches(/^0\d{9}$/)
    @ApiProperty({ required: true })
    phone: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(4, { message: 'La ville doit comporter plus 4 caractères'})
    @MaxLength(20, { message: 'La ville doit comporter moins de 20 caractères'})
    @IsAlpha()
    @ApiProperty({ required: true })
    city: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(4, { message: 'Le code postal doit comporter plus 4 caractères'})
    @MaxLength(6, { message: 'Le code postal doit comporter moins de 6 caractères'})
    @IsAlpha()
    @ApiProperty({ required: true })
    postalCode: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(4, { message: 'L\'adresse doit comporter plus 4 caractères'})
    @MaxLength(20, { message: 'L\'adresse doit comporter moins de 20 caractères'})
    @IsAlpha()
    @ApiProperty({ required: true })
    address: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(4, { message: 'Le chemin de l\'image doit comporter plus 4 caractères'})
    @MaxLength(30, { message: 'Le chemin de l\'image doit comporter moins de 30 caractères'})
    @IsAlpha()
    @ApiProperty({ required: true })
    profilePicture: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ required: true })
    userId: string;

    
    // @IsNotEmpty()
    // @IsString()
    // @ApiProperty({ required: true })
    // user: string;
}
