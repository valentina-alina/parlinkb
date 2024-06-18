/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, MinLength, MaxLength, IsAlpha, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
//TODO:
export class CreateChildDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(2, { message: 'Le prénom doit comporter plus 4 caractères'})
    @MaxLength(20, { message: 'Le prénom doit comporter moins de 20 caractères'})
    @IsAlpha()
    @ApiProperty({ required: true })
    firstName: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(2, { message: 'Le prénom doit comporter plus 4 caractères'})
    @MaxLength(20, { message: 'Le prénom doit comporter moins de 20 caractères'})
    @IsAlpha()
    @ApiProperty({ required: true })
    lastName: string;

       
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ required: true })
    school: string;

      
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ required: true })
    classe: string;
}
