/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, MinLength, MaxLength, IsAlpha, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
//TODO:
export class CreateChildDto {
    
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    firstName: string;
  
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    lastName: string;
  
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    school: string;
  
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    class: string;
}
