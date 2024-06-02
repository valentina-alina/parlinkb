/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsStrongPassword, IsString, MinLength, MaxLength, Matches, IsAlpha } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {

    @IsNotEmpty()
    @IsString()
    @MinLength(4, { message: 'Le prénom doit comporter plus 4 caractères'})
    @MaxLength(20, { message: 'Le prénom doit comporter moins de 20 caractères'})
    @IsAlpha()
    @ApiProperty({ required: true })
    firstName: string;

    @IsNotEmpty()
    @IsString()
    @IsStrongPassword()
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password too weak'})
    @ApiProperty({ required: true })
    password: string;
}