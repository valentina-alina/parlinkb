/* eslint-disable prettier/prettier */
import { Controller, Get, /* Post,*/ Body, Put,  Param, Delete, Query, HttpException, HttpStatus } from '@nestjs/common';
import { AdService } from './ad.service';
import { Ad, Prisma } from '@prisma/client';
// import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';

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
  async findAllByParams(@Query() options: {skip?: string, take?: string }): Promise<Ad[]> {
    const new_options: Prisma.AdFindManyArgs = {}
    options.skip? new_options.skip = +options.skip : null
    options.take? new_options.take = +options.take : null

    return this.adService.findAllByParams(new_options);
  }

  @Get(':id')
  async readRoute(
      @Param('id') id: string,
  ): Promise<Ad | { message: string }> {
  
    const ad = await this.adService.findByUnique({ id });

    if (!ad) throw new HttpException('L\'annonce n\'a pas été trouvée', HttpStatus.CONFLICT)

    return {
      ...ad,
      message: `Annonce avec l'id ${id}`
    };
  }

  @Put(':id')
  async updateRoute(
      @Param('id') id: string,
      @Body() adUpdateDto: UpdateAdDto,
  ): Promise<{ad: Ad, message: string}> {
      const ad = await this.adService.findByUnique({ id });
      
      if (!ad) throw new HttpException('L\'annonce n\'a pas été trouvée', HttpStatus.CONFLICT)

      const adUpdate = await this.adService.update({ id }, adUpdateDto);

      const message = `L'annonce avec l'id ${id} a bien été mise à jour`;

      return {
        ad: adUpdate,
        message
      }
  }

  @Delete(':id')
  async deleteRoute(@Param('id') id: string,): Promise<Ad | { message: string }> {

    const ad = await this.adService.findByUnique({ id })

    if(!ad) throw new HttpException('L\'annonce n\'a pas été trouvée', HttpStatus.CONFLICT)

    this.adService.delete({ id });

    return { message: `L'annonce avec l'id ${id} a bien été supprimée` }
  }
}