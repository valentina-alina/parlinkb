/* eslint-disable prettier/prettier */
import { IsString, IsOptional, IsArray } from 'class-validator';
import { CreateChildDto } from 'src/child/dto/create-child.dto';
import {CreateUserDto } from './create-user.dto'


export class RegisterUserDto {
    user: CreateUserDto;

    @IsArray()
    @IsString({ each: true })
    subjects: string[];

    @IsOptional()
    children?: [CreateChildDto] | null
}