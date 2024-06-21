/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, MinLength, MaxLength, IsAlpha, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
//TODO:
export class CreateUHSDto {
    
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    userId: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    subjectId: string;
 
}
