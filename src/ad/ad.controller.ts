/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Put,  Param, Delete, Query, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { AdService } from './ad.service';
import { Ad, Prisma, UserHasAds } from '@prisma/client';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { UserService } from '../../src/user/user.service';
import { AuthGuard } from '../guards/jwt.guards';
import { GetAdsFilterDto } from './dto/get-ads-filter.dto';
import { GetAdsCategoryDto } from './dto/get-ads-category.dto';
import { GetAdsUserDto } from './dto/get-ads-user.dto';

//? ROUTE FILTRE BARRE DE RECHERCHE PAR TITRE | VILLE
//? ROUTE FILTRE CATÉGORIE & SOUS-CATÉGORIE
//? ROUTE PAGINATION??
//? ROUTE AFFICHER ANNONCE PAR UTILISATEUR [OU DANS USER.CONTROLLER??]
//? USER CREATE SUBSCRIPTION/S
//? USER READ ALL SUBSCRIPTIONS
//? USER READ SUBSCRIPTIONS BY PARAMS --> UPDATE | DELETE [FINDBYPARAMS]
//? USER READ SUBSCRIPTIONS BY ID --> UPDATE | DELETE [FINDBYUNIQUE]
//? USER UPDATE SUBSCRIPTIONS
//? USER DELETE SUBSCRIPTIONS


@Controller('ad')
export class AdController {
  constructor(
    private readonly adService: AdService,
    private readonly userService: UserService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() data: CreateAdDto): Promise<{ ad: Ad, message: string}> {
    const user = await this.userService.findByUnique({id : data.userId})
      if (!user) throw new HttpException(`L'utilisateur n'existe pas`, HttpStatus.CONFLICT)

    const new_ad =  await this.adService.create({
      title: data.title,
      description: data.description,
      startTime: data.startTime,
      endTime: data.endTime,
      duration: data.duration,
      address: data.address,
      postalCode: data.postalCode,
      city: data.city,
      country: data.country,
      attendees: data.attendees,
      lat: data.lat,
      lng: data.lng,
      transport: data.transport,
      conform: data.conform,
      status: data.status,
      adPicture: data.adPicture,
      users: { connect: { id: data.userId } },
      category: { connect: { id: data.categoryId } },
      subCategory: { connect: { id: data.subCategoryId } },
    });

    return {
      ad: new_ad,
      message: `L'annonce a bien été créée`
    }
  }

  @UseGuards(AuthGuard)
  @Get()

  async findAllByParams(@Query() options: {skip?: string, take?: string }): Promise<{ads: Ad[], message: string}> {
    const new_options: Prisma.AdFindManyArgs = {}
    options.skip? new_options.skip = +options.skip : null
    options.take? new_options.take = +options.take : null

    /* skip: options.skip ? +options.skip: 0,
    take: options.take ? +options.take: 6, */

    const ads = await this.adService.findAllByParams(new_options)

    return {
      ads,
      message: `Liste d'annonces filtrées`
    };
  }

  @Get('params')
  async findAllByFilters(
    @Query() {search}: GetAdsFilterDto,
  ): Promise<{ads: Ad[], message: string}> {

    const ads = await this.adService.findAllByFilters(search)

    return {
      ads,
      message: `Liste d'annonces filtrées`
    };
  }

  @Get('categories')
  async findAllByCategories(
    @Query() categoryParams: GetAdsCategoryDto,
  ): Promise<{ads: Ad[], message: string}> {

    const ads = await this.adService.findAllByCategories(categoryParams)

    return {
      ads,
      message: `Liste d'annonces filtrées`
    };
  }

  @Get('user')
  async findAllByUser(
    @Query() {id}: GetAdsUserDto,
  ): Promise<{userAds: Ad[], message: string}> {

    const userAds = await this.adService.findAllByUser(id)

    return {
      userAds,
      message: `Liste d'annonces de l'utilisateur`
    };
  }

  @Get(':id')
  async readRoute(
      @Param('id') id: string,
  ): Promise<{ ad: Ad, message: string}> {
  
    const ad = await this.adService.findByUnique({ id });

    if (!ad) throw new HttpException('L\'annonce n\'a pas été trouvée', HttpStatus.CONFLICT)

    return {
      ad,
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

      return {
        ad: adUpdate,
        message: `L'annonce avec l'id ${id} a bien été mise à jour`
      }
  }

  @Delete(':id')
  async deleteRoute(@Param('id') id: string,): Promise<Ad | { message: string }> {

    const ad = await this.adService.findByUnique({ id })

    if(!ad) throw new HttpException('L\'annonce n\'a pas été trouvée', HttpStatus.CONFLICT)

    this.adService.delete({ id });

    return {
      message: `L'annonce avec l'id ${id} a bien été supprimée`
    }
  }

  @Post('subscribe/:id')
  async subscribeUserToAd(
    @Param('id') adId: string,
    @Body() { userId }: { userId: string },
  ): Promise<{ subscription: UserHasAds, message: string }> {

    const user = await this.userService.findByUnique({ id: userId });
    if (!user) throw new HttpException(`L'utilisateur n'existe pas`, HttpStatus.CONFLICT);

    const ad = await this.adService.findByUnique({ id: adId });
    if (!ad) throw new HttpException(`L'annonce n'existe pas`, HttpStatus.CONFLICT);

    const subscription = await this.adService.subscribeUserToAd(userId, adId);

    return {
      subscription,
      message: `L'utilisateur a été inscrit à l'annonce avec succès`
    };
  }

  @Get('subscriptions/:userId')
  async getSubscriptionsByUserId(@Param('userId') userId: string): Promise<{ subscriptions: UserHasAds[], message: string }> {

    const subscriptions = await this.adService.getAllSubscriptionsByUserId(userId);

    return {
      subscriptions,
      message: `Liste des inscriptions de l'utilisateur avec l'id ${userId}`
    };
  }

  @Get('subscriptions/:userId/params')
  async getSubscriptionsByUserParams(
    @Param('userId') userId: string,
    @Query() params: { title?: string, city?: string }
  ): Promise<{ subscriptions: UserHasAds[], message: string }> {

    const subscriptions = await this.adService.getAllSubscriptionsByUserParams(userId, params);
    return {
      subscriptions,
      message: `List des annonces de l'utilisateur avec l'id ${userId} filtrées`
    };
  }

  @Put('subscriptions/:userId/:adId')
  async updateUserAdSubscription(
    @Param('userId') userId: string,
    @Param('adId') adId: string,
    @Body() updateData: Prisma.UserHasAdsUpdateInput
  ): Promise<{ subscription: UserHasAds, message: string }> {

    const subscription = await this.adService.updateUserAdSubscription(userId, adId, updateData);

    return {
      subscription,
      message: `Inscription avec l'id ${adId} pour l'utilisateur avec l'id ${userId} mise à jour correctement`
    };
  }

  @Delete('subscriptions/:userId/:adId')
  async deleteUserAdSubscription(
    @Param('userId') userId: string,
    @Param('adId') adId: string
  ): Promise<{ message: string }> {
    await this.adService.deleteUserAdSubscription(userId, adId);
    
    return {
      message: `L'inscription à l'annonce ${adId} pour l'utilisateur avec l'id ${userId} a été supprimée`
    };
  }
}