/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheService } from './cache.service';
import { redisStore } from 'cache-manager-redis-yet';

// const redisUrl = process.env.REDIS_URL;
@Module({
    imports: [
        CacheModule.registerAsync({
            useFactory: async () => ({                
                store: await redisStore({
                    url: 'redis://redis:6379',
                    ttl: 600,
                }),
            }),
        }),
    ],
    providers: [CacheService],
    exports: [CacheService],
})
export class AppCacheModule {}