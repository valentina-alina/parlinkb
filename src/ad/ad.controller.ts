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
import { PaginatorQueryInterface } from 'src/interfaces/paginator';
import { ResponseAdPromiseInterface, ResponseAdsPromiseInterface } from './interface/response.interface';
import { responseCode } from 'src/utils/response.utils';


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

@UseGuards(AuthGuard)
@Controller('ad')
export class AdController {
  constructor(
    private readonly adService: AdService,
    private readonly userService: UserService,
  ) { }
  

  @Get()
  async findAll(@Query() options: PaginatorQueryInterface): ResponseAdsPromiseInterface{
    return {
      ads: await this.adService.findAllByParams(options),
      message: responseCode().success.event.filter
    }
  }

  @Get('params')
  async findAllByFilters(
    @Query() {search}: GetAdsFilterDto,
  ): ResponseAdsPromiseInterface {
    return {
      ads: await this.adService.findAllByFilters(search),
      message:  responseCode().success.event.filter
    };
  }

  @Get('categories')
  async findAllByCategories(
    @Query() categoryParams: GetAdsCategoryDto,
  ): ResponseAdsPromiseInterface {
    return {
      ads: await this.adService.findAllByCategories(categoryParams),
      message:  responseCode().success.event.filter
    };
  }

  @Get('user')
  async findAllByUser(
    @Query() {id}: GetAdsUserDto,
  ): Promise<{userAds: Ad[], message: string}> {
    return {
      userAds: await this.adService.findAllByUser(id),
      message:responseCode().success.event.filterUser
    };
  }

  @Get(':id')
  async readRoute(
      @Param('id') id: string,
  ): ResponseAdPromiseInterface {
  try {
    return {
      ad: await this.adService.findByUnique({ id }),
      message: responseCode(id).success.event.byId
    };
  } catch (error) {
   throw new HttpException(responseCode(id).error.event.byId, HttpStatus.NOT_FOUND)  
  }
   
  }


  @Post()
  async create(@Body() data: CreateAdDto): ResponseAdPromiseInterface {
    try {
      if (!await this.userService.exist(data.userId)) throw new HttpException(responseCode(data.userId).error.event.user, HttpStatus.CONFLICT)
  
      const { userId, categoryId, subCategoryId, ...datas } = data;
      return {
        ad:  await this.adService.create(datas, {userId, categoryId, subCategoryId}),
        message: responseCode().success.event.create
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @Put(':id')
  async updateRoute(
      @Param('id') id: string,
      @Body() adUpdateDto: UpdateAdDto,
  ): ResponseAdPromiseInterface {
    try {
      return {
        ad:  await this.adService.update({ id }, adUpdateDto),
        message: responseCode().success.event.update
      }
    } catch (error) {
      throw new HttpException(responseCode(id).error.event.update, HttpStatus.NOT_FOUND)  
    }
     
  }

  @Delete(':id')
  async deleteRoute(@Param('id') id: string): Promise<{ message: string }> {

    const ad = await this.adService.delete({ id });
    if(!ad) throw new HttpException(responseCode(id).error.event.delete, HttpStatus.CONFLICT)
    return {
      message: responseCode(id).success.event.delete
    }
  }


/**
 * ************************
 *    SUBSCRIBE PART
 * ************************
 */

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