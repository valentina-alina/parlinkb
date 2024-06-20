/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ProfileModule } from './profile/profile.module';
import { ChildModule } from './child/child.module';
import { AdModule } from './ad/ad.module';
import { FileModule } from './file/file.module';
import { CategoryModule } from './category/category.module';
import { SubjectModule } from './subject/subject.module';
import { UserGroupModule } from './user-group/user-group.module';
import { MessageModule } from './message/message.module';
import { AuthModule } from './auth/auth.module';
import { AppCacheModule } from './cache/cache.module';
import { ConfigModule } from '@nestjs/config';
import { SubCategoryModule } from './subCategory/subCategory.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // This makes the ConfigModule global, so you don't need to import it everywhere.
    }),
    UserModule,
    AuthModule,
    ProfileModule,
    ChildModule,
    AdModule,
    FileModule,
    CategoryModule,
    SubjectModule,
    UserGroupModule,
    MessageModule,
    AppCacheModule,
    SubCategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}