/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserGroupService } from './user-group.service';
import { CreateUserGroupDto } from './dto/create-user-group.dto';
import { UpdateUserGroupDto } from './dto/update-user-group.dto';

//TODO: USER CREATE USER GROUP
//TODO: USER READ ALL USER GROUPS
//TODO: USER READ USER GROUPS BY PARAMS --> UPDATE | DELETE [FINDBYPARAMS]
//TODO: USER READ USER GROUPS BY ID --> UPDATE | DELETE [FINDBYUNIQUE]
//TODO: USER UPDATE USER GROUPS
//TODO: USER DELETE USER GROUPS

@Controller('user-group')
export class UserGroupController {
  constructor(private readonly userGroupService: UserGroupService) {}

  @Post()
  create(@Body() createUserGroupDto: CreateUserGroupDto) {
    return this.userGroupService.create(createUserGroupDto);
  }

  @Get()
  findAll() {
    return this.userGroupService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userGroupService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserGroupDto: UpdateUserGroupDto) {
    return this.userGroupService.update(+id, updateUserGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userGroupService.remove(+id);
  }
}
