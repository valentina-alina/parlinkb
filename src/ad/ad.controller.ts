/* eslint-disable prettier/prettier */
import { Controller, Get, /* Post, Body, Patch, */ Param, Delete } from '@nestjs/common';
import { AdService } from './ad.service';
// import { CreateAdDto } from './dto/create-ad.dto';
// import { UpdateAdDto } from './dto/update-ad.dto';

//TODO: ROUTE FILTRE BARRE DE RECHERCHE PAR TITRE | VILLE
//TODO: ROUTE FILTRE CATÉGORIE & SOUS-CATÉGORIE
//TODO: ROUTE PAGINATION??
//TODO: ROUTE AFFICHER ANNONCE PAR UTILISATEUR [OU DANS USER.CONTROLLER??]

//TODO: USER CREATE AD
//TODO: USER READ ALL ADS
//TODO: USER READ ADS BY PARAMS
//TODO: USER READ AD BY ID
//TODO: USER UPDATE AD
//TODO: USER DELETE SELF PUBLISHED AD/S

//!

//TODO: USER CREATE SUBSCRIPTION/S
//TODO: USER READ ALL SUBSCRIPTIONS
//TODO: USER READ SUBSCRIPTIONS BY PARAMS --> UPDATE | DELETE [FINDBYPARAMS]
//TODO: USER READ SUBSCRIPTIONS BY ID --> UPDATE | DELETE [FINDBYUNIQUE]
//TODO: USER UPDATE SUBSCRIPTIONS
//TODO: USER DELETE SUBSCRIPTIONS

//!

@Controller('ad')
export class AdController {
  constructor(private readonly adService: AdService) {}

/*   @Post()
  create(@Body() createAdDto: CreateAdDto) {
    return this.adService.create(createAdDto);
  } */

  @Get()
  findAll() {
    return this.adService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adService.findOne(+id);
  }

/*   @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdDto: UpdateAdDto) {
    return this.adService.update(+id, updateAdDto);
  } */

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adService.remove(+id);
  }
}
