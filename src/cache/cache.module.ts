/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheService } from './cache.service';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
    imports: [
        CacheModule.registerAsync({
            useFactory: async () => ({
                store: await redisStore({
                    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
                    ttl: 600,
                }),
            }),
        }),
    ],
    providers: [CacheService],
    exports: [CacheService],
})
export class AppCacheModule {}