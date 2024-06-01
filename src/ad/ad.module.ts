/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AdService } from './ad.service';
import { AdController } from './ad.controller';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AdController],
  providers: [AdService],
})
export class AdModule {}
