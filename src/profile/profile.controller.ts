/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpException, HttpStatus } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Prisma, Profile } from '@prisma/client';
import { UserService } from '../user/user.service';

//TODO: CREATE , UPDATE , READ , DELETE MY PROFILE  ??

@Controller('profile')
export class ProfileController {
 
  constructor(private readonly profileService: ProfileService, 
    private readonly userService: UserService) {}
 
  
  @Get()
  async findAllByParams(@Query() options: {skip?: string, take?: string }): Promise<Profile[]> {
    const new_options: Prisma.ProfileFindManyArgs = {}
    options.skip? new_options.skip = +options.skip : null
    options.take? new_options.take = +options.take : null

    return this.profileService.findAllByParams(new_options);
  }

  @Post()
  async create(){
    console.log("create")
    return ("create vide");
  }

  // @Post()
  // async create(@Body() createProfileDto:CreateProfileDto): Promise<{profile:Profile, message:string}> {
  //   console.log("cc");
  //   const user = await this.userService.findByUnique({id : createProfileDto.userId})
  //     if (!user) throw new HttpException(`L'utilisateur n'existe pas`, HttpStatus.CONFLICT) 
   

        
  //       const profile =  await this.profileService.create({
  //         phone: createProfileDto.phone,
  //         address: createProfileDto.address,
  //         profilePicture: createProfileDto.profilePicture,
  //         postalCode: createProfileDto.postalCode,
  //         city: createProfileDto.city,
  //         user: { connect: { id: createProfileDto.userId } },
          
  //       }); 
  //       const message = `Le profile a bien été créée`
  //       return {
  //         profile: profile,
  //     message
  //   } 
  // }


//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.profileService.findOne(+id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
//     return this.profileService.update(+id, updateProfileDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.profileService.remove(+id);
//   }
// }
// function Query(): (target: ProfileController, propertyKey: "findAllByParams", parameterIndex: 0) => void {
//   throw new Error('Function not implemented.');
// }

}



