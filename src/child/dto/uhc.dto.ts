/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, MinLength, MaxLength, IsAlpha, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
//TODO:
export class CreateUHCDto {
    
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    userId: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    childId: string;
 
}
