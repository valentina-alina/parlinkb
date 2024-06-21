/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, MinLength, MaxLength, IsAlpha, IsEmail, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateChildDto } from 'src/child/dto/create-child.dto';
import { AuthCreateUserDto } from './auth-create-user';
import { Subject } from 'rxjs';

export class RegisterUserDto {
user : AuthCreateUserDto;

@IsArray()
@IsString({ each: true })
subject: string[];

@IsOptional()
childrens? : [CreateChildDto] | null
}