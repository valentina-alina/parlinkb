/* eslint-disable prettier/prettier */
import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
    constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

    async get(key: string): Promise<string> {
        return this.cacheManager.get(key);
    }

    async set(key: string, value: string | number, ttl: number): Promise<void> {
        await this.cacheManager.set(key, value, ttl);
    }

    async del(key: string): Promise<void> {
        await this.cacheManager.del(key);
    }
}