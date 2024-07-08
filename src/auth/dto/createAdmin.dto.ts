/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsString, MinLength, MaxLength, IsAlpha } from 'class-validator';

export class CreateAdminDto {

  @IsNotEmpty()
  @IsString()
  @MinLength(2, { message: 'Le prénom doit comporter plus 2 caractères' })
  @MaxLength(20, { message: 'Le prénom doit comporter moins de 20 caractères' })
  @IsAlpha()
  @ApiProperty({ required: true })
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2, { message: 'Le nom doit comporter plus 2 caractères' })
  @MaxLength(20, { message: 'Le nom doit comporter moins de 20 caractères' })
  @IsAlpha()
  @ApiProperty({ required: true })
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ required: true })
  email: string;
}