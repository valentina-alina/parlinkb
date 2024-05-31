/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, MaxLength, IsAlpha } from 'class-validator';

export class CreateProfileDto {

    @IsNotEmpty()
    @IsString()
    @MinLength(4, { message: 'Le prénom doit comporter plus 4 caractères'})
    @MaxLength(20, { message: 'Le prénom doit comporter moins de 20 caractères'})
    @IsAlpha()
    @ApiProperty({ required: true })
    city: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(4, { message: 'Le prénom doit comporter plus 4 caractères'})
    @MaxLength(20, { message: 'Le prénom doit comporter moins de 20 caractères'})
    @IsAlpha()
    @ApiProperty({ required: true })
    postalCode: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(4, { message: 'Le nom doit comporter plus 4 caractères'})
    @MaxLength(20, { message: 'Le nom doit comporter moins de 20 caractères'})
    @IsAlpha()
    @ApiProperty({ required: true })
    address: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(4, { message: 'Le nom doit comporter plus 4 caractères'})
    @MaxLength(20, { message: 'Le nom doit comporter moins de 20 caractères'})
    @IsAlpha()
    @ApiProperty({ required: true })
    profilePicture: string;
}
