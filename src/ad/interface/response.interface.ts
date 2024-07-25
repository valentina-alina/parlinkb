/* eslint-disable prettier/prettier */

import { Ad } from "@prisma/client";

export type ResponseAdsPromiseInterface = Promise<{ ads: Ad[], message: string; }>

export type ResponseAdPromiseInterface=  Promise<{ ad: Ad, message: string; }>